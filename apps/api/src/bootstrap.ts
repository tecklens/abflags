import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import {AppModule} from "@app/app.module";
import {initializeTransactionalContext} from "typeorm-transactional";

declare const module: any;

// * -------------------------------------------------------------------------------------

const corsOptionsDelegate = function (req, callback) {
  const corsOptions = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    maxAge: 86400,
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  if (
    ['dev', 'test', 'local'].includes(process.env.NODE_ENV) ||
    isBlueprintRoute(req.url)
  ) {
    corsOptions.origin = '*';
  } else {
    corsOptions.origin = [
      process.env.FRONT_BASE_URL,
      process.env.API_ROOT_URL,
      'https://accounts.google.com',
    ];
    if (process.env.WIDGET_BASE_URL) {
      corsOptions.origin.push(process.env.WIDGET_BASE_URL);
    }
  }
  callback(null, corsOptions);
};

export default async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: false,
  });

  const configService = app.get(ConfigService);

  const apiVersion = configService.get('APP_VERSION');

  // * swagger
  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setDescription(configService.get('APP_DESCRIPTION'))
    .setVersion(configService.get('APP_VERSION'))
    .addTag('Auth')
    .addTag('User')
    .addTag('Project')
    .addTag('Feature')
    .addTag('Metric')
    .addTag('Event')
    .addTag('Application')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'api_key', in: 'header', description: 'API Key For External calls' })
    .addServer([configService.get('CONTEXT_PATH'), apiVersion].join('/'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // * cors
  app.use(helmet());
  app.enableCors(corsOptionsDelegate);

  // * context path
  app.setGlobalPrefix([configService.get('CONTEXT_PATH'), apiVersion].join('/'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  app.use(
    bodyParser.json({
      limit: '5mb',
      verify: (req: any, res, buf) => {
        const url = req.originalUrl;
        if (url.includes('/stripe/webhook')) {
          req.rawBody = buf.toString();
        }
      },
    }),
  );

  app.use(compression());

  app.enableShutdownHooks();

  await app.init();

  Logger.log('BOOTSTRAPPED SUCCESSFULLY');

  const port = configService.get('PORT') ?? 3232;
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
  Logger.log(`Starting UserApplication using Nestjs 10.0.0 on port: ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

function isBlueprintRoute(url: string) {
  return url.startsWith('/v1/blueprints');
}

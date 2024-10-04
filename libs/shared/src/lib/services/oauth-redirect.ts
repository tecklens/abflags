import { NotFoundException } from '@nestjs/common';

export const buildOauthRedirectUrl = (request: {
  frontendUrl: string,
  user: {
    token: string;
    newUser: any;
  };
  query: {
    state: string;
  };
}): string => {
  let url = request.frontendUrl + '/sign-in';

  if (!request.user || !request.user.token) {
    return `${url}?error=AuthenticationError`;
  }

  const redirectUrl = JSON.parse(request.query.state).redirectUrl;

  /**
   * Make sure we only allow localhost redirects for CLI use and our own success route
   * https://github.com/tecklens/tk-wolf//security/code-scanning/3
   */
  if (
    redirectUrl &&
    redirectUrl.startsWith('http://localhost:') &&
    !redirectUrl.includes('@')
  ) {
    url = redirectUrl;
  }

  url += `?token=${request.user.token}`;

  if (request.user.newUser) {
    url += '&newUser=true';
  }

  /**
   * partnerCode, next and configurationId are required during external partners integration
   * such as vercel integration etc
   */
  const partnerCode = JSON.parse(request.query.state).partnerCode;
  if (partnerCode) {
    url += `&code=${partnerCode}`;
  }

  const next = JSON.parse(request.query.state).next;
  if (next) {
    url += `&next=${next}`;
  }

  const configurationId = JSON.parse(request.query.state).configurationId;
  if (configurationId) {
    url += `&configurationId=${configurationId}`;
  }

  const inviteToken = JSON.parse(request.query.state).inviteToken;
  if (inviteToken) {
    url += `&inviteToken=${inviteToken}`;
  }

  return url;
};

export const buildGoogleOauthRedirectUrl = (request: {
  frontendUrl: string,
  user: {
    email: string;
    newUser: boolean;
    token: string;
    inviteToken: string;
  };
  query: {
    code: string;
    scope: string;
    authuser: string;
  };
}): string => {
  if (!request.user) {
    throw new NotFoundException('No user from google');
  }
  console.log('request', request);
  let url = request.frontendUrl + '/sign-in';

  if (!request.user || !request.user.token) {
    return `${url}?error=AuthenticationError`;
  }

  url += `?token=${request.user.token}`;

  if (request.user.newUser) {
    url += '&newUser=true';
  }

  // const next = JSON.parse(request.query.state).next;
  // if (next) {
  //   url += `&next=${next}`;
  // }
  //
  // const configurationId = JSON.parse(request.query.state).configurationId;
  // if (configurationId) {
  //   url += `&configurationId=${configurationId}`;
  // }
  //
  // const inviteToken = JSON.parse(request.query.state).inviteToken;
  // if (inviteToken) {
  //   url += `&inviteToken=${inviteToken}`;
  // }

  return url;
};

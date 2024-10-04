import { Button } from "@client/components/custom/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@client/components/ui/table";
import { IconCircleCheckFilled, IconMinus } from '@tabler/icons-react'

interface PlanFeature {
  type: string;
  features: {
    name: string;
    free: boolean | string;
    startup: boolean | string;
    team: boolean | string;
    enterprise: boolean | string;
  }[];
}

const planFeatures: PlanFeature[] = [
  {
    type: "Usage",
    features: [
      {
        name: "Notifications",
        free: '1K',
        startup: '10K',
        team: '100K',
        enterprise: '1M',
      },
      {
        name: "Additional Events",
        free: 'N/A',
        startup: '$0.001 per additional event over 10k',
        team: '200RpS',
        enterprise: '1000rps',
      },
      {
        name: "Trigger Rate Limit (Requests per Second)",
        free: '5RpS',
        startup: '50RpS',
        team: '200RpS',
        enterprise: '1000RpS',
      },
      {
        name: "Unlimited Workflows",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Unlimited Providers",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Subscribers",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Team Members",
        free: '2 members',
        startup: '10 members',
        team: 'Unlimited',
        enterprise: 'Unlimited',
      },
      {
        name: "Log data retention",
        free: '7 day',
        startup: '30 day',
        team: '30 day',
        enterprise: '90 day',
      },
    ],
  },
  {
    type: "Core features",
    features: [
      {
        name: "SSO by Github",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "End-to-end logs and debugging",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Edit Wolfx Branding",
        free: false,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Total ERC20 exchange funds flow",
        free: false,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Translation Management",
        free: false,
        startup: 'Comming Soon',
        team: 'Comming Soon',
        enterprise: 'Comming Soon',
      },
    ],
  },
  {
    type: "Support",
    features: [
      {
        name: "Support SLA",
        free: false,
        startup: '1 business day',
        team: '1 business day',
        enterprise: '1 business day',
      },
      {
        name: "Community via Discord",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Email",
        free: false,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Private Chat",
        free: false,
        startup: false,
        team: true,
        enterprise: true,
      },
    ],
  },
];

export default function PricingSectionCards() {
  return (
    <>
      <div className="container py-8">
        {/* Comparison table */}
        <div className="">
          <div className="lg:text-center mb-10 lg:mb-12">
            <h3 className="text-2xl font-semibold dark:text-white">
              Compare plans
            </h3>
            <Button variant={'outline'} size={'lg'} className="mt-3">Contact us</Button>
          </div>
          {/* xs to lg */}
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-3/12 text-primary">Plans</TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Free
                </TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Business
                </TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Team
                </TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Enterprise
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planFeatures.map((featureType) => (
                <>
                  <TableRow className="bg-muted/50" key={featureType.type}>
                    <TableCell colSpan={5} className="font-bold">
                      {featureType.type}
                    </TableCell>
                  </TableRow>
                  {featureType.features.map((feature) => (
                    <TableRow
                      key={feature.name}
                      className="text-muted-foreground"
                    >
                      <TableCell>{feature.name}</TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {typeof feature.free === 'string' ?
                            <div className="text-center">{feature.free}</div>
                            : feature.free ? (
                              <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                            ) : (
                              <IconMinus className="h-5 w-5" />
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {typeof feature.startup === 'string' ?
                            <div className="text-center">{feature.startup}</div>
                            : feature.startup ? (
                              <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                            ) : (
                              <IconMinus className="h-5 w-5" />
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {typeof feature.team === 'string' ?
                            <div className="text-center">{feature.team}</div>
                            : feature.team ? (
                              <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                            ) : (
                              <IconMinus className="h-5 w-5" />
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {typeof feature.enterprise === 'string' ?
                            <div className="text-center">{feature.enterprise}</div>
                            : feature.enterprise ? (
                              <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                            ) : (
                              <IconMinus className="h-5 w-5" />
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-24 lg:hidden">
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Free</h4>
              </div>
              <Table>
                {planFeatures.map((featureType) => (
                  <>
                    <TableRow
                      key={featureType.type}
                      className="bg-muted hover:bg-muted"
                    >
                      <TableCell
                        colSpan={2}
                        className="w-10/12 text-primary font-bold"
                      >
                        {featureType.type}
                      </TableCell>
                    </TableRow>
                    {featureType.features.map((feature) => (
                      <TableRow
                        className="text-muted-foreground"
                        key={feature.name}
                      >
                        <TableCell className="w-11/12">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {feature.enterprise ? (
                            <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                          ) : (
                            <IconMinus className="h-5 w-5" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </Table>
            </section>
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Startup</h4>
              </div>
              <Table>
                {planFeatures.map((featureType) => (
                  <>
                    <TableRow
                      key={featureType.type}
                      className="bg-muted hover:bg-muted"
                    >
                      <TableCell
                        colSpan={2}
                        className="w-10/12 text-primary font-bold"
                      >
                        {featureType.type}
                      </TableCell>
                    </TableRow>
                    {featureType.features.map((feature) => (
                      <TableRow
                        className="text-muted-foreground"
                        key={feature.name}
                      >
                        <TableCell className="w-11/12">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {feature.startup ? (
                            <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                          ) : (
                            <IconMinus className="h-5 w-5" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </Table>
            </section>
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Team</h4>
              </div>
              <Table>
                {planFeatures.map((featureType) => (
                  <>
                    <TableRow
                      key={featureType.type}
                      className="bg-muted hover:bg-muted"
                    >
                      <TableCell
                        colSpan={2}
                        className="w-10/12 text-primary font-bold"
                      >
                        {featureType.type}
                      </TableCell>
                    </TableRow>
                    {featureType.features.map((feature) => (
                      <TableRow
                        className="text-muted-foreground"
                        key={feature.name}
                      >
                        <TableCell className="w-11/12">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {feature.team ? (
                            <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                          ) : (
                            <IconMinus className="h-5 w-5" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </Table>
            </section>
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Enterprise</h4>
              </div>
              <Table>
                {planFeatures.map((featureType) => (
                  <>
                    <TableRow
                      key={featureType.type}
                      className="bg-muted hover:bg-muted"
                    >
                      <TableCell
                        colSpan={2}
                        className="w-10/12 text-primary font-bold"
                      >
                        {featureType.type}
                      </TableCell>
                    </TableRow>
                    {featureType.features.map((feature) => (
                      <TableRow
                        className="text-muted-foreground"
                        key={feature.name}
                      >
                        <TableCell className="w-11/12">
                          {feature.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {feature.enterprise ? (
                            <IconCircleCheckFilled className="h-5 w-5 text-green-600" />
                          ) : (
                            <IconMinus className="h-5 w-5" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </Table>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

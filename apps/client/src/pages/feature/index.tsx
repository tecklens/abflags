import { IFeature } from "@abflags/shared";
import { RepositoryFactory } from '../../api/repository-factory';
import { Layout, LayoutBody, LayoutHeader } from '../../components/custom/layout';
import { Search } from '../../components/search';
import ThemeSwitch from "@client/components/theme-switch";
import { useToast } from '../../components/ui/use-toast';
import { UserNav } from '../../components/user-nav';
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeatureInfo from "./components/feature-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ComingSoon from "@client/components/coming-soon";
import FeatureOverview from './components/overview';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';

const FeatureRepository = RepositoryFactory.get('feature')

export default function FeatureDetail() {
    const { id } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate()
    const [feature, setFeature] = useState<IFeature | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = useCallback(() => {
        if (!id || isLoading) return;
        FeatureRepository.byId(id)
            .then((resp: AxiosResponse) => {
                if (resp.status === HttpStatusCode.Ok) {
                    setFeature(resp.data);
                } else {
                    setFeature(undefined);
                }
            }).catch((e: any) => {
                if (axios.isAxiosError(e)) {
                    toast({
                        variant: 'destructive',
                        title: e.response?.data?.message,
                    })
                }
            })
    }, [id])

    useEffect(() => {
        if (id) {
            fetchData()
        } else {
            navigate('/404')
        }
    }, [id])

    return (
        <Layout>
            {/* ===== Top Heading ===== */}
            <LayoutHeader>
                <Search />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </LayoutHeader>

            <LayoutBody className="flex flex-col gap-3" fixedHeight>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">abflags</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{feature?.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
                {feature ? <>
                    <FeatureInfo feature={feature} />
                    <Tabs defaultValue="overview">
                        <TabsList className="env-switcher grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="metric">Metric</TabsTrigger>
                            <TabsTrigger value="setting">Settings</TabsTrigger>
                            <TabsTrigger value="event_log">Event log</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">
                            <FeatureOverview feature={feature} />
                        </TabsContent>
                        <TabsContent value="metric">
                            <ComingSoon className="h-auto py-16" />
                        </TabsContent>
                        <TabsContent value="setting">
                            <ComingSoon className="h-auto py-16" />
                        </TabsContent>
                        <TabsContent value="event_log">
                            <ComingSoon className="h-auto py-16" />
                        </TabsContent>
                    </Tabs>
                </>
                    : <div className="w-full flex justify-center">
                        <span className="font-semibold text-gray-600">Có lỗi xảy ra</span>
                    </div>
                }
            </LayoutBody>
        </Layout>
    )
}
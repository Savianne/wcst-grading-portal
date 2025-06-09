import { SidebarProvider } from "../context/SideBarProvider";
import PageHeader from "./PageHead";
import PageSideBar from "./PageSideBar";
import PageContentContainer from "./PageContentContainer";
import PageErrorAlert from "../components/PageErrorAlert";
import PageSuccessAlert from "../components/PageSuccessAlert";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PageHeader />
      <PageSideBar />
      <PageContentContainer>
        {children}
      </PageContentContainer>
      <PageErrorAlert />
      <PageSuccessAlert />
    </SidebarProvider>
  )
}
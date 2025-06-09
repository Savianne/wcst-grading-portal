import { SidebarProvider } from "../context/SideBarProvider";
import PageHeader from "./PageHead";
import PageSideBar from "./PageSideBar";
import PageContentContainer from "./PageContentContainer";

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
    </SidebarProvider>
  )
}
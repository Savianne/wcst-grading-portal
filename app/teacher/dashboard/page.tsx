import WelcomeTeacher from "./WelcomeTeacher";
export default async function TeachersPage({
  params,
}: {
  params: Promise<{ accountUID: string }>,
}) {
    const uid = (await params).accountUID;
    return (
        <>
          <WelcomeTeacher />
        </>
    )
}

import AccountPanel from "./AccountPanel"

export default async function AddStudentsPage({
  params,
}: {
  params: Promise<{ accountUID: string }>,
}) {
    const uid = (await params).accountUID;
    return (
        <>
            <AccountPanel uid={uid}/>
        </>
    )
}

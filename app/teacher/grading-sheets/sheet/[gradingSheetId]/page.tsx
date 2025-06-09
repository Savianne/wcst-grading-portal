import Sheet from "./Sheet";

export default async function AddStudentsPage({
  params,
}: {
  params: Promise<{ gradingSheetId: string }>,
}) {
    const uid = (await params).gradingSheetId;
    return (
        <>
            <Sheet sheetId={uid} />
        </>
    )
}

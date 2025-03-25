import { getLectureDetail } from "../helper/lectureHelper";

export async function lectureDetails(id: string) {
  const lecture = await getLectureDetail(id);

  if (lecture === null) throw { status: 404, message: "Lecture does not exist." };

  return lecture;
}

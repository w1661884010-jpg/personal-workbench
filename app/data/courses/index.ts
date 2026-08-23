import { analogCourse } from "./analog";
import { digitalCourse } from "./digital";
import { signalsCourse } from "./signals";

export const courses = [signalsCourse, digitalCourse, analogCourse] as const;
export const courseById = Object.fromEntries(courses.map((course) => [course.id, course]));

import {Static, Type} from '@sinclair/typebox';

export const Course = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type CourseType = Static<typeof Course>;

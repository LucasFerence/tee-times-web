import {Static, Type} from '@sinclair/typebox';
import {Course} from './course';

export const Club = Type.Object({
  id: Type.String(),
  name: Type.String(),
  courses: Type.Array(Course),
});

export type ClubType = Static<typeof Club>;

import {Static, Type} from '@sinclair/typebox';

export const User = Type.Object({
  id: Type.String(),
  username: Type.String(),
  password: Type.String(),
});

export type UserType = Static<typeof User>;

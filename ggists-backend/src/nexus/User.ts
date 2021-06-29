import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  description: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('email');
    t.string('username');
  },
});

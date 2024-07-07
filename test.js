import * as changeKeys from 'change-case/keys';

const toto = changeKeys.camelCase({
  id: 1,
  pseudo: 'Max',
  last_login: 12456789,
  refresh_token: "refresh_token",
  createdAt: 45678,
});

console.log(toto);

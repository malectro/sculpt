# sculpt

Emulates React's `update` addon and freezes all return values. See the [Immutability Helpers article](https://facebook.github.io/react/docs/update.html) for more information on the non-freezing, original `update`.

```
import sculpt from 'sculpt';

let user = {
  name: 'Guy Man',
};

let sculpt(user, {
  name: {
    $set: 'Hue Man',
  },
});

user.name = 'Fake Name';
console.log(user.name); // 'Hue Man'
```

Also exposes all dollar sign commands as functions for simpler oneoff calls.

```
import {push} from 'sculpt';

let users = [{
  name: 'Whoa Man',
}];

users = push(users, {
  name: 'Miss Siz',
});

users.pop();
console.log(users[1].name); // 'Miss Siz'
```


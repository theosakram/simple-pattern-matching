# simple-pattern-matching

## WHAT

This library is simple pattern matching for ADT or Union

```typescript
type User = ADT<{
    admin: {
        adminId: string
    },
    user: {
        userId: number
    }
}>
```

## WHY

Because I prefer pattern matching more than switch-case, and typescript does not have native implementation of said feature.
I use this library for personal use.

## Example

```typescript
type User = ADT<{
  admin: {
    adminId: string;
  };
  user: {
    userId: number;
  };
}>;

declare const user: User;

const x = matchI(user)({
  admin: ({ adminId }) => adminId,
  user: ({ userId }) => String(userId),
});

const y = matchPI(user)({
  admin: ({ adminId }) => adminId,
  _: () => 'hehe',
});

type UserUnion = 'admin' | 'user' | 'student';

declare const allUser: UserUnion;

const z = matchLI(allUser)({
  admin: () => 'Admin',
  student: () => 'Student',
  user: () => 'User',
});
```

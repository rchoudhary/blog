+++
title = "Pointers on Pointers: Fun with Memory"
date = 2020-06-10
draft = true
summary = "tbd"
+++

## Computer Memory

_This is a brief recap of what memory is just in case someone needs it, feel free to skip if you know this stuff! However, please read the highlighted bit at the end!!_

We're going to think of computer memory as just a collection of slots where we can put whatever data we want. Each slot has an **address** associated with it which tells us where the data lives. Every slot can store exactly **8 bits** of data.

For example, I can stick the number `5` in memory at address `0x47`. If I need to get the number back, I just go look in address `0x47`. If I want to change the number to `6`, then I just put a `6` in `0x47` and _overwrite_ the `5` (the `5` is lost and there's no way to know what was there before).

Note that you can't stick data in only part of a slot; you either use the whole slot or you don't. Even though you only need 3 bits to represent `5`, you take up the whole 8-bit slot. `5` in binary is `101`. To turn that into an 8-bit number, we **sign-extend** it.

What if I want to store a number larger than 8 bits, something like `1000`? Well, in that case, we would need to use multiple slots of memory. To represent `1000` you need 10 bits.

## Messing with `const` (super fun!)

Let's have some more fun messing around with `const` things! Consider this code:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 82;

    cout << " x = " << x << endl;
    cout << endl;

    const int* p = &x; // A pointer to x with a const pointee
    int* q = (int*)p; // A pointer to x, but with a non-const pointee
    *q = 29; // NOT illegal!

    cout << " x = " << x << endl;
    cout << "*p =" << *p << endl;
    cout << "*q =" << *q << endl;
}

```

The output of this code is

```
 x = 82

 x = 29
*p = 29
*q = 29
```

This means that we successfully changed the value of `x`!

The reason we pulled it off is that `p` is a `const int*` who contents are `&x` (the address of `x`). The type of `p` indicates we can't use `p` to change whatever is at memory location `&x`.

However, we can copy the contents of `p` into another pointer `q` whose type is `int`. We're basically taking `&x` from `p` and putting it into `q` as well. However, `p` is of type `const int*` and we want `q` to be of type `int*`, so we need to do a cast to drop the `const`.

Now since `q` points to `x` as well, we can use it to modify the contents of `x`!

Now, what if `x` itself is `const`? Do our casting tricks still work? Consider this code:

```cpp
#include <iostream>
using namespace std;

int main() {
    const int x = 82;

    cout << " x = " << x << endl;
    cout << endl;

    int* p = (int*)&x; // A pointer to a const int
    *p = 29; // Will this work?

    cout << " x = " << x << endl;
    cout << "*p =" << *p << endl;
    cout << *p << endl;
}
```

The results are super interesting. First, we print the initial value of `x`. We then create a `int* p` which is pointer to `x`. Note that we had to cast `&x` with `(int*)` to remove the `const`. After that use `p` to attempt to change the value of `x` even though it's `const`. We then read `x` using the variable itself and using the pointer `p`. Here are the results of the code:

```
 x = 82

 x = 82
*p = 29
```

What?!? `p` and `x` refer to the same memory location, how are they reading different values?! According to `p`, our nefarious code was successful. According to `x`, the purity of `const`-ness has not been violated.

Unfortunately we have just run into **undefined behavior (aka UB)**. The C++ standard says that if you try to strip the `const` off of variables, there's no telling what exactly will happen. The behavior of the program from then on out is undefined.

UB is pretty bad. Imagine if we had some `if (...)` statements that used `*p` to check the value of `x` and some `if (...)` statements that used `x` itself to check the value of `x`. They would have been inconsistent with each other, and the flow of our entire program could've been ruined!

But wait, why is this example so much worse compared to the previous one where we stripped the `const` off of the pointer?

The main thing we need to realize is that `x` names the memory location at `&x`, so whatever it says goes.

In the first example, `x` was non-`const`, which means that the memory location `&x` is free to be read from or written to. `p` declared itself as `const int*`. That doesn't mean that the memory location it points to is read only, it just means that `p` promises not to modify it. `p` is essentially self-censoring, and that's `p`'s problem, not `x`'s!

`q` on the other hand takes the contents of `p` to get access to the same memory location, but it decides not to make the same `const` promise as `p`. This is perfectly fine because the memory location `&x` is not-inherently read-only so `q` is not breaking any laws.

However, in the second example, `x` was declared `const` which means the memory location `&x` is meant to _truly_ be read only. Messing around with pointers gave us a way to hack our way around the restrictions, but after that, we're in uncharted waters...

+++
title = "Pointer Basics"
date = 2020-01-12T16:09:46-06:00
draft = true
summary = "Pointers are a notoriously tricky topic when learning C and C++. I believe that some basic visualizations will help the harder aspects quite a bit simpler. In this first article, we'll look at what a pointer is, how to make one, and the very beginnings of how to use them. In later articles, we'll start exploring more advanced usages."
+++

## "Normal" Variables (A Quick Refresher)

To understand pointers, we must first revisit our good friend, the (vanilla) variable!

Let's say we have some code like this:

```cpp
int main() {
    int myVar = 5;
}
```

Declaring a variable allocates a chunk of memory. Since the type of the variable is `int`, this chunk of memory will be 4 bytes in size. A value of `5` will be placed in that chunk. This chunk will also have an address associated with it.

We will visualize this allocation graphically like so:

{{< figure
  src="/images/pointer-basics/var_padded.png#c"
  alt="Our visual representation of a variable"
  caption="This is how we'll visualize variables from here on out"
>}}


As noted before, the address I gave `myVar` above is completely made up. In fact, the specific value doesn't actually matter. That's because we'll never use the address to manipulate that chunk of memory. Instead, we'll use the name `myVar` itself. Here's an example of us reading from and writing to `myVar`:

```cpp
#include <iostream>
using namespace std;

int main() {
    int myVar = 5;
    // Reading myVar:
    cout << "myVar = " << myVar << endl; // Prints myVar = 5

    // Writing to myVar:
    myVar = 19;
    cout << "myVar = " << myVar << endl; // Prints myVar = 19
}
```

The main takeaway is how we're going to visualize variables in memory. With that in mind, let's move on to what we came here for...

## Pointers

Here is what the definition of a pointer is, according to [the Wikipedia article](https://en.wikipedia.org/wiki/Pointer_(computer_programming)):

> In computer science, a pointer is a programming language object that stores the memory address of another value located in computer memory.

Put another way, <span class="hl">a pointer is just a variable that contains a memory address</span>. 

That's it, nothing more to it! Well then what's the big deal then with pointers?

The hard part is _using pointers correctly_. Keeping that basic definition in mind will help make that part a lot easier though.

But enough words, let's see some more code and pictures!

### Making Pointers

Here is the simplest example of a pointer:

```cpp
using namespace std;

int main() {
    int* p;
}
```

The type of `p` is `int*`. That `*` after the `int` means that `p` contains the _address_ of another variable whose type is `int`. 

We say that `p` is a **pointer** to an `int`.

<div class="aside">

A Note on Syntax

There are 3 equivalent ways to declare a pointer to an integer:

```cpp
int* p;
int *p;
int * p;
```

Which one you use is a matter of personal taste. I like the first one and it's the one I will use throughout.

However, **there is a BIG potential pitfall with this syntax!**

To declare multiple `int`'s on the same line you write

```cpp
int x, y, z;
```

So you would think that

```cpp
int* px, py, pz;
```

declares 3 pointers to integers, right?

Unfortunately, no. `px` is a pointer to an integer, but `py` and `pz` are just `int`'s. The `*` only applies to the next variable declared. To declare multiple pointers, you need to do this:

```cpp
int *px, *py, *pz;
```

Rather than use that syntax though, I just declare pointers on separate lines.

</div>

So now we've declared `p` to be a pointer to an integer, but what address does it contain?

The answer is, as of right now, we don't know! We need to **initialize** it.

To do that we need to populate the pointer `p` with an address of some variable that is an `int`. Let's say we have code like this:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    int* p;
}
```

To get the address of `x` so that we can put it in `p`, we need to use the **address-of operator:** `&`

As the name implies, this operator gives us the address of a variable. For example, [from the earlier visualization of a variable](#var_padded), `myVar` referred to a chunk of memory at address of `0x5814`. So `&myVar` would return `0x5814`.

To put the address of `x` into `p`, we just need to assign it:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    int* p = &x; // Put the address of x into p
}
```

Since `p` contains the address of `x`, we say that **`p` points to `x`**.

In general, <span class="hl">whenever a pointer contains the address of some variable, we say that it's a _pointer to_ that variable.</span>

Note that there's nothing special going on in the previous code. To put the value `7` into the variable `x`, we just write `x = 7`. To put the address of `x` into the variable `p` we just write `p = &x` where `&x` is the address of `x`. Easy peasy!

Here is how we can visualize this situation:

{{< figure
  src="/images/pointer-basics/var-and-ptr_padded.png#c"
  alt="A variable and a pointer visualized"
  caption="Notice how `p` contains the address of `x`"
>}}

To summarize what's going on:

* `x` contains the value `7`
* The address of `x` is `0x729E`
* `p` contains the value `0x729E`, i.e. the address of `x`
* Since `p` contains the address of `x`, we say that "`p` points to `x`"

A natural question is, how big is the chunk of memory allocated for `p`?

Well, we know that `p` contains an address, and in my examples, addresses are 16 bits or 2 bytes. Thus, we can conclude that the size of a pointer (in my examples) is 2 bytes.

<div class="aside">

Pointer Sizes on an Actual Computer

Remember that your computer is either a 32-bit or a 64-bit machine. 

If it's a **32-bit** machine, then all addresses are 32 bits, which means all pointers are **4 bytes** big.

If it's a **64-bit** machine, then all addresses are 64 bits, which means all pointers are **8 bytes** big.

</div>

Let's consider a slightly more complicated example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    char c = 'a';

    int* px = &x; // px points to x
    char* pc = &c; // pc points to c
}
```

What is the size of `pc` compared to the size of `px`?  A `char` is smaller than an `int`, so would a `char*` be smaller than an `int*`?

The answer is **no**. All pointers are just variables that contain **addresses**. Thus they are all exactly the size of an address, which means <span class="hl">all pointers are the same size.</span>

The `char` in `char*` and the `int` in `int*` refer to the type of the variable that is pointed _to_. It has no effect on the size of the pointer itself.

[This sample program should help drive the point home](https://repl.it/@rchoudhary/PointerSizes).

What if the type of the pointer and the type of the variable it points to don't match like shown below?

```cpp
#include <iostream>
using namespace std;

int main() {
    float e = 2.718;
    int* p = &e;
}
```

`p` has type `int*` which means it **must** contain the address of a variable whose type is an `int`. Thus, if you try to run that code, you'll get a compiler error that will look something like this:

```
exit status 1
main.cpp: In function 'int main()':
main.cpp:6:15: error: cannot convert 'float*' to 'int*' in initialization
     int* p = &e;
```

<div class="aside">

Understanding That Compiler Error

Let's say we have a variable `char c`. `&c` returns a `char*`. If we had a variable `bool b`, then `&b` returns a `bool*`. 

The pattern is clear: <span class="hl">if you have some variable `x` with type `T`, then `&x` returns a `T*`.</span>

In the example above, `e` was a `float`, which means `&e` returns a `float*`. The compiler yelled at us because we tried to assign a `float*` to `p` which was declared to be of type `int*`.

</div>

Alright, enough with making pointers, let's start doing something with 'em!

### Dereferencing Pointers

Here is what the [Wikipedia article on pointers](https://en.wikipedia.org/wiki/Pointer_(computer_programming)) has to say about dereferencing:

>A pointer _references_ a location in memory, and obtaining the value stored at that location is known as _dereferencing_ the pointer.

To make sense of this, let's go back to this sample code and it's associated diagram:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    int* p = &x; // Assign the address of x into p
}
```

{{< figure
  src="/images/pointer-basics/var-and-ptr_padded.png#c"
  alt="A variable and a pointer visualized"
  caption="Remember this?"
>}}

In our example above, `p` contains `0x729E`, the address of `x`. Thus `p` **references** `0x729E`, or more intuitively, `p` **references** `x`. 

**Dereferencing** `p` means getting the contents at memory location `0x729E`, i.e. the contents of `x`.

In general, <span class="hl">**dereferencing** a pointer gives us the contents of the variable it points to.</span>

To dereference a pointer, we use the **dereference operator:** `*`

Here's some basic dereferencing in action:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    int* p = &x; // Put the address of x into p

    cout << "x = " << x << endl; // Get the value of x directly
    cout << "x = " << *p << endl; // Get the value of x indirectly 
    						      // by dereferencing
}
```

We expect to get the same value for `x` in both cases, and indeed if you run that program, you'll get:

```
x = 7
x = 7
```

So now we have accessed the contents of `x` in two ways:

1. _Directly_ through the variable `x` itself
2. _Indirectly_ by dereferencing a pointer `p` to the variable `x`

Let's think again about data types. Particularly, when we dereference, what do we get back?

When we access `x` we get an int back because `x` is an `int`. `p` is a pointer to an `int`, so when we dereference `p`, we get an `int` back.

If we dereferenced a `char*` we'd get a `char` back, if we dereferenced a `double*` we'd get a `double`, and so on and so forth.

Can we dereference a, `int*` into a `char` like so?

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 64;
    int* p = &x;
    char c = *p; // Is that legal?
    cout << "c = " << c << endl;
}
```

Weirdly enough, if you [run that code](https://repl.it/@rchoudhary/MixedDereferencing), you'll see that you can! The output of the program is

```
c = @
```

What is going on?!

Remember that `*p` returns the integer that `p` points to, which is `x`, which has a value of `64`. So essentially we're trying to assign the integer `64` to `c`, which is a `char`. Since an `int` can be _implicitly converted_ to a `char`, this is a legal operation. The ascii value for the `'@'` is 64, which explains the output.

If for some reason an `int` couldn't be implicitly converted to a `char`, you'd get a compiler error.

By the way, dereferencing isn't just good for reading variables...

### Writing with Pointers

...we can write to those variables as well!

Assigning to a dereferenced pointer means assigning to the variable that the pointer points to.

We're going to focus on this example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 15;
    int* p = &x;
    cout << "x = " << x << endl;
    *p = 2319; // Write to the variable that p points to
    cout << "x = " << x << endl;
}
```

Lines 5 and 6 establish `p` as a pointer to `x`. Line 8 says "take the value `2319` and assign it to the variable pointed to by p". Since `p` points to `x`, we have just modified `x`.

[Running the program](https://repl.it/@rchoudhary/DereferenceWriting) yields:

```
x = 15
x = 2319
```

What's really neat about this example is that **we've just modified `x` without directly assigning to `x`!**

{{< figure
  src="/images/pointer-basics/meme.png#c"
  alt="A topical meme"
  attr="© Nickelodeon (please don't sue me)"
>}}

Of course, this seems highly unnecessary when we could have just done `x = 2319`, but indirectly modifying variables is pretty cool and useful in other less contrived contexts.

A good question at this point would be, what data types can we write? For instance, is the following valid code?

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 15;
    int* p = &x;
    cout << "x = " << x << endl;
    *p = 23.5f; // Is that legal?
    cout << "x = " << x << endl;
}
```

If you [run that program](https://repl.it/@rchoudhary/DererferenceWritingWeird), you'll see that it is indeed valid code. This is the output:

```
x = 15
x = 23
```

The code compiles and runs because a `float` can be implicitly converted to an `int` just by chopping off the fraction part (although the compiler will probably warn you that it is doing so). 

Remember, if the thing you're assigning can't be implicitly converted to the type you're trying to assign to, then you'll get a compiler error.

## Visualization Update

So up until now, for code like this:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    int* p = &x; // Assign the address of x into p
}
```

we've visualized something like this:

{{< figure
  src="/images/pointer-basics/var-and-ptr_padded.png#c"
  alt="A variable and a pointer visualized"
  attr="This is how we've been visualizing pointers, but there's a lot going on there..."
>}}

Now that we're past some of the basics, we'll want to drop all the unnecessary info that just crowds the diagrams. So we should instead visualize that previous snippet like this:

{{< figure
  src="/images/pointer-basics/var-and-ptr-2_padded.png#c"
  alt="A variable and a pointer visualized, improved"
  attr="A _cleaner_ way to visualize a variable and a pointer"
>}}

The changes are:

1. Addresses are not shown anymore since we don't care about their explicit value
2. The contents of `p`, which was an address, are no longer shown.
3. An arrow is drawn from the contents of `p` to `x`. This show that `p` contains the address of `x`, i.e. `p` points to `x`.

This new, cleaner visualization will make it easier to analyze more complex situations.

Now, we'll move on to cover the bane of all C/C++ programmers...

## Null Pointers

So a pointer can point to a chunk of memory, but can we make it point to nothing?

As you can guess, yes we can. A pointer that contains an address of `0` is known as a **null pointer**, and it points to nothing.

In C, if you include the system file `stddef.h` you can use the macro `NULL` instead of a literal 0 for readability purposes.

If you try to dereference a null pointer for either reading or writing, you get an error and your program will certainly crash. [Here is an example](https://repl.it/@rchoudhary/NullPointerDereferencing).

<div class="aside">

Null Pointers in C++11

So in C and all versions of C++ before C++11, people would declare null pointers by assigning `0` or `NULL` to a pointer. In C++11 and beyond, it is recommended to instead use the keyword `nullptr` like so:

```
int *p = nullptr; // A null pointer, the modern C++ way!
```

If you're curious as to why you should use this, [check out this StackOverflow post](https://stackoverflow.com/questions/13816385/what-are-the-advantages-of-using-nullptr).

</div>


Here's a group of null pointers:

```cpp
#include <stddef.h>
using namespace std;

int main() {
    int* p = 0; // Valid in C and C++
    int* q = NULL; // Valid in C and C++
    int* r = nullptr; // Valid only in C++11 and beyond
}
```

and here's how we'll visualize them:

{{< figure
  src="/images/pointer-basics/null-ptrs_padded.png#c"
  alt="Null pointers visualized"
  attr="Here's how we'll visualize pointers that point to nothing"
>}}

## `const` Pointers

You may already know the `const` keyword, but in case you don't, here is a quick refresher: a `const` variable is one that cannot be modified. A bit more technically, it means that the chunk of memory it refers to is **read-only**, meaning you cannot write to it. Here's a small snippet to demonstrate:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    const int k = 7;

    cout << x << endl; // Reading x -- OK
    x = 23;            // Writing to x -- OK

    cout << k << endl; // Reading k -- OK
    k = 91;            // Writing to k -- ILLEGAL!!
}
```

The line `k = 91` will give you a compiler error.

What's neat (or not) is that `int const x` and `const int x` mean the same thing. Moving the `const` keyword like that doesn't change anything! 

Note that `int x const` is not valid syntax however. `const` is part of the type of `x`, and so it must be to the left of the variable name.

Now what does `const` mean in terms of pointers? When it comes to pointers, there are **3 places** you can put the `const` keyword:

1. `const int* p`
2. `int const * p`
3. `int* const p`

_(I'm just using `int` as a placeholder data type. Of course the following discussion is valid for `bool`, `float`, etc.)_

Placements 1 and 2 are equivalent and refer to the fact that the "pointee" (the thing that is pointed to) is constant. Placement 3 means the pointer itself is constant. We will go into further detail for both cases.

### Constant Pointee

As stated earlier, `const int* p` and `int const * p` mean the same thing: the chunk of memory _pointed to_ by `p` is write-only.

Put another way, it means we can dereference `p` to _read_ what it points to, but we can't _modify_ what it points to.

This prevents you from writing code like this:

```cpp
int main() {
    int x = 82;
    const int* p = &x; // a pointer with const pointee
    *p = 29; // ILLEGAL!!
}
```

### Constant Pointer

`int* const p` means that the contents of _`p` itself_ is write-only. Thus, we cannot change _where_ `p` points.

However, we _can_ change the _thing_ that `p` points _to_. This example should clarify things:

```cpp
int main() {
    int x = 82;
    int* const p = &x; // p points to x and we can't change this!
    *p = 29; // Modifying x to contain 29 -- OK!

    int y = 1; // Another variable
    p = &y; // Making p point somewhere else -- ILLEGAL!!
}
```

### Combining Placements

You might be wondering if you can have multiple `const` keywords in a single declaration. The answer is that you most certainly can!

You can write something like `const int* const p`. In this case, we can _neither_ change _where_ `p` points _nor_ the _thing_ it points _to_. Once again, a small snippet will clear things up:

```cpp
int main() {
    int x = 82;
    const int* const p = &x;
    *p = 29; // Modifying the thing p points to -- ILLEGAL!

    int y = 1; // Another variable
    p = &y; // Making p point somewhere else -- ILLEGAL!!
}
```

## Summing it all up

So now we have covered all the very basics you would need to know about pointers:

1. Declaring pointers, with and without `const`
2. Making pointers point to things
3. Dereferencing pointers to read and write
4. Null pointers

Next, we'll go over one of the major uses of pointers: **pass by reference!**
+++
title = "Pointers on Pointers: The Basics"
date = 2020-06-09
summary = "In this article we'll go over the very basics of pointers: what they are, how to make one, and the utmost basic way to use them. This guide is primarily intended for people learning C++ and are confused by pointers."
+++

## "Normal" Variables (A Quick Refresher)

To understand pointers, we must first revisit a familiar concept: the variable! Here is what the definition of a variable is, according to our boi [Wikipedia](https://en.wikipedia.org/wiki/Variable_(computer_science)):

> A variable or scalar is a storage address (identified by a memory address) paired with an associated symbolic name, which contains some known or unknown quantity of information referred to as a value

Put more briefly, <span class="hl">a **variable** is a chunk of memory that has a name and contains some data.</span>

In C and C++, variables also have a _type_ associated with them that tells you how big a chunk of memory the variable takes up and what kind of data the chunk contains.

Every uniquely named variable corresponds to a _unique_ chunk of memory!

Let's say we have some code like this:

```cpp
int main() {
    int x;
}
```

This creates a chunk of memory and names it `x`. The type of the variable is `int`, which means that the chunk is 4 bytes and will contain an [integer](https://en.wikipedia.org/wiki/Integer). This chunk will have a memory address associated with it.

We can represent the variable graphically like so:

{{< figure
  src="/images/pointer-basics/x_uninit.png#c"
  alt="A variable is just a chunk of memory with an attached name. The contents of the chunk of memory are unknown since x is uninitialized"
  caption="An uninitialized variable visualized"
>}}

The box represents the chunk of memory, the red text above the box is the _name_ we've given the chunk of memory (which is the variable name in the code), and the green text below the box represents the _address_ of that chunk of memory.

One thing I should mention right away is that the address is something I made up. To be honest, the specific value doesn't actually matter. That's because we'll never use the address to deal with that chunk of memory. Instead, we'll only need to use the name `x`. That's what makes variables so nice!

The stuff in the box represents the _contents_ of the chunk of memory. Since `x` is uninitialized (meaning we haven't given it an initial value), we don't know what it contains. We represent that fact with a [pale cornflower blue](https://www.google.com/search?q=pale+cornflower+blue&tbm=isch&ved=2ahUKEwjgo6me0_TpAhUN96wKHS55DIsQ2-cCegQIABAA&oq=pale+cornflower+blue&gs_lcp=CgNpbWcQAzICCAAyAggAMgIIADoGCAAQBxAeOggIABAHEAUQHjoICAAQCBAHEB5Q9j5YikJgq0NoAHAAeACAAVyIAbYDkgEBNZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=T3XfXqDANo3uswWu8rHYCA&bih=708&biw=1440) `???`.

If we want to avoid the mysterious `???`, we can simply _initialize_ `x` to whatever we want:

```cpp
int main() {
    int x = 5; // Initialize x to 5
}
```

{{< figure
  src="/images/pointer-basics/x_init.png#c"
  alt="The contents of the variable are known now that x has been initialized"
  caption="An initialized variable visualized"
>}}

The yellow text in the box represents the (now initialized) contents of the variable, and as we can see, it's `5` just as we want! 😄

The next thing we'll take a refresher on is reading from variables and writing to them.

We can _read_ the contents of `x` by using the variable, and we write to `x` by _assigning_ to the variable. Here's an example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    // Reading from x:
    cout << x << endl; // Prints "5"

    // Writing to x:
    x = 19;

    // Reading the new value from x:
    cout << x << endl; // Prints "19"
}
```

Simply using the variable `x` in `cout << x << endl` _reads_ its value and prints it. Assigning to `x` via `x = 19` _writes_ to the chunk of memory, changing the contents to `19` instead of `5`.

Finally, we can _copy_ the _contents_ of one variable into another by assigning one variable to another or by initializing one variable with another:

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10; // a is initialized to 10

    int b; // b is uninitialized
    b = a; // Copy the contents of a into b

    int c = a; // Initialize c to contain the contents of a
}
```

Note that `b` wasn't initialized, and we _assigned_ to it the contents of `a`. However, `c` was _initialized_ with the contents of `a`. Considering only that snippet of code, there doesn't seem to be much of a difference. However, remember that we don't know what uninitialized variables contain, so if we tried to read `b` between lines 7 and 8, we don't know what we would get back 😕

Here's a little animation that shows the state of memory at various points of time:

{{< figure
  src="/images/pointer-basics/abc_animated.gif#c"
  alt="The previous snippet of code visualized"
  caption="The previous snippet of code visualized"
>}}

Not to hammer on a point too much, but notice how `b` was uninitialized for a brief moment, while `c` came out swinging with the contents of `a`.

Anyways, that concludes our recap. Let's move on to the good stuff!

## Pointers

Here is what the definition of a pointer is, according to our boi [Wikipedia](https://en.wikipedia.org/wiki/Pointer_(computer_programming)):

> A pointer is a programming language object that stores the memory address of another value located in computer memory.

Put another way, <span class="hl">a **pointer** is basically a variable that contains a memory address</span>.

That's it!

The definition may be simple, but the hard part is using pointers _correctly_. Keeping basics in mind will help make that a lot easier though.

But enough words, let's see some more code (which is also words I guess) and pictures!

### Making Pointers

Here is the simplest example of a pointer:

```cpp
using namespace std;

int main() {
    int* p;
}
```

This syntax is a little bit different than the syntax for a variable we saw earlier, but it tells us all the same things because remember: `p` is basically just a variable!

This creates a chunk of memory and names it `p`. This chunk will also have a memory address associated with it.

Now the type of that variable looks a little different than normal variables. We declared the type of the `p` to be `int*`. That `*` after the `int` means that `p` will contain the _address_ of _another_ variable whose type is `int`. We say **`p` is a pointer to an `int`**.

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

What does it mean for `p` to contain the address of an `int`?

It means that if I look at the _contents_ of `p` I'll see an address. If I go to that address in memory, I'll see an `int`. That's all!

So now we've declared `p` to be a pointer to an integer, but what address does it contain?

The answer is, as of right now, we don't know! Remember that this is the case when a variable is uninitialized. That means that `p` looks like this right now:

{{< figure
  src="/images/pointer-basics/p_uninit.png#c"
  alt="An uninitialized pointer visualized"
  caption="An uninitialized pointer visualized"
>}}

Just like with normal variables, we can _initialize_ `p`. Since `p` is of type `int*`, it should contain the address of an `int`. Let's say we have code like this:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p; // We want to put the address of an int here
}
```

`y` is an `int`, so we can put its address into `p`!

To do that, we'll need to use the **address-of operator:** `&`. As the name implies, this operator gives us the address of a variable. For example, [from the earlier visualization of a variable](#x_init), `x` referred to a chunk of memory at address of `0x713`. So `&x` would return `0x713`.

How do we put the address of `y` into `p`?

Well, remember that `&y` is just some piece of data, and `p` is just like a normal variable. As we saw earlier, to put data into a variable, we just _assigned_ it. So to put an address into `p`, we can just assign it too!

Here's a short example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5; // Put the value 5 into y
    int* p = &y; // Put the address of y into p
}
```

This is what memory looks like after `y` and `p` are initialized:

{{< figure
  src="/images/pointer-basics/ptr_to_y.png#c"
  alt="Initializing a pointer with the address of another variable"
  caption="Initializing a pointer with the address of another variable"
>}}

Notice that the _contents_ of `p` are the same as the _address_ of `y`!

Since `p` now contains the address of `y`, we say that **`p` points to `y`**.

In general, <span class="hl">whenever a pointer contains the address of some variable, we say that it **points to** that variable.</span>

For the sake of brevity, we'll refer the thing pointed to as the **pointee**. So in the previous snippet of code, `y` is the _pointee_ of `p`. It may not be a widely used term, but that's a shame because it's pretty efficient.

...

Speaking of efficient, the visualizations have a lot going on, but there's a trick we can use to make them simpler! Turns out, we don't actually care what the exact addresses of `p` and `y` are; we only care that `p` points to `y`. So let's scrap addresses and just draw that relationship:

{{< figure
  src="/images/pointer-basics/ptr_to_y_simple.png#c"
  alt="A simplified visualization of p pointing to y"
  caption="A much simpler visual"
>}}

The green arrow from `p` to `y` indicates that `p` points to `y`. The arrow starts inside `p` because `p` _contains_ the address of `y`.

...

BTW, just like with variables, we can _copy_ the contents of one pointer to another pointer via assignment. Take a look at this code:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p = &y; // Put the address of y into p

    int* q = p; // Initialize q with the contents of p

    int* r;
    r = p; // Copy the contents of p into r
}
```

Here the `int* q = p;` means to read the content of `p` (which has the address of `y`) and _initialize_ `q` with them. Now since `q` has the address of `y`, it too now points to `y`.

`r` on the other hand starts out uninitialized, which means at first we don't know what it points to. However, `r = p;` _copies_ the contents of `p` into `r`. After that, `r` contains `&y` as well, which means it points to `y` too.

{{< figure
  src="/images/pointer-basics/pqr_animated.gif#c"
  alt="The previous snippet of code visualized"
  caption="The previous snippet of code visualized"
>}}

Thus, we have created three pointers to `&y`!

### Pointer Sizes

You'll notice that we skipped over an important question in that last section: how big is the chunk of memory allocated for our pointers??

Take a look at this code:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p = &y; // p points to y
}
```

We know that the _type_ of `p` is `int*`, which means that it contains the _address_ of an `int`. The important part is that `p` contains an _address_. On my computer, all addresses are 64 bits aka 8 bytes. Thus, we can conclude that the size of `p` is 8 bytes! For you that number might be different though. You can print out `sizeof(int*)` to see how big addresses are on your system.

What about pointers that point to different kinds of variables? Consider this example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 4109;
    char c = 'a';

    int* pi = &i; // pi points to i
    char* pc = &c; // pc points to c
}
```

The type of `pi` is `int*` (aka pointer to `int`), and the type of `pc` is `char*` (aka pointer to `char`). We know that a `char` is smaller than an `int`... so is the size of `pc` smaller than the size of `pi`?

I've put the answer in the aside section below to give you a chance to work it out for yourself 😉

<div class="aside">

Answer to the question above

The answer is **no**, `pc` is **not** smaller than `pi`!

Remember that the _type_ of a variable tells us what the variable contains which lets us know how big it is.

The type of `pi` is `int*`, which means it contains the _address_ of an `int`. The type of `pc` is `char*`, which means it contains the _address_ of a `char`. Both pointers contain addresses, so both pointers must be the same size.

In general, <span class="hl">all pointers are the same size!</span>

The `char` in `char*` and the `int` in `int*` refer to the type of the variable that is pointed _to_. It has no effect on the size of the pointer itself.

[This sample program should help drive the point home](https://repl.it/@rchoudhary/PointerSizes).

</div>

### Mismatching Types

What if while making a pointer, the type of the pointer and the type of the pointee don't match like shown below?

```cpp
#include <iostream>
using namespace std;

int main() {
    float e = 2.718; // Less mainstream than π
    int* p = &e; // Is this possible?
}
```

`p` has type `int*` which means it **must** contain the address of a variable whose type is `int`. Thus, if you try to run that code, you'll get a compiler error that'll look something like this:

```
main.cpp: In function 'int main()':
main.cpp:6:15: error: cannot convert 'float*' to 'int*' in initialization
     int* p = &e;
```

Let's pick apart that error!

Say we have a variable `char c`. `&c` returns the address of a `char`, which is represented by `char*`. If we had a variable `bool b`, then `&b` returns the address of a `bool`, which is represented by `bool*`.

The pattern is pretty obvious: <span class="hl">if you have some variable `v` with type `T`, then `&v` returns a `T*`.</span>

In the example above, `e` was a `float`, which means `&e` returns a `float*`. The compiler yelled at us because we tried to assign a `float*` to `p` which was declared to be of type `int*`.

"But wait", you might say. "I thought pointers just contained addresses. An address is an address, so why are a `float*` and an `int*` different?"

Well this is where pointers stop acting _just_ like variables. A `float*` and an `int*` both contain addresses of variables, but they contain the addresses of different _types_ of variables.

Let's suppose that I could assign `&e` to `p`. `&e` is of type `float*`, which means that if I go to that address in memory, I expect to see a `float`. But `p`, which contains `&e` now, is of type `int*`. That means if I go to the address contained in `p`, I expect to find an `int`! So the memory location `&e` supposedly contains an `int` and a `float`, which is a contradiction! Thus we cannot allow `&e` to be assigned to `p`.

<div class="aside">

Forcing a square peg into a round hole...

You might have enough C/C++ experience to know that a simple cast would let the assignment go through with no problem:

```cpp
#include <iostream>
using namespace std;

int main() {
    float e = 2.718;
    int* p = (int*)&e; // This is fine. [insert meme]
}
```

Forcing a cast like that can be either cool or bad depending on what you do with it. We'll talk about this more in a later article. For now, don't force the square peg into the round hole!!

</div>

### Reading With Pointers

The coolest thing you do with a pointer is **dereference** it. That sounds pretty sick, but what is it?

Here is what our boi [Wikipedia](https://en.wikipedia.org/wiki/Pointer_(computer_programming)) has to say about dereferencing:

>A pointer _references_ a location in memory, and obtaining the value stored at that location is known as _dereferencing_ the pointer.

To make sense of this, let's go back to this sample code:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p = &y; // Assign the address of y to p
}
```

So we saw that since `p` contains the address of `y`, we say that it points to `y`. Well, according to Wikipedia, we can also say that `p` _references_ `y`.

**Dereferencing** `p` means getting the contents at the memory location contained in `p`, i.e. the contents of memory location `&y`. This of course is just the contents of `y` itself.

In general, <span class="hl">dereferencing a pointer gives us the contents of the pointee.</span>

Recall that this was the diagram we used to represent that code:

{{< figure
  src="/images/pointer-basics/ptr_to_y_simple.png#c"
  alt="A variable and a pointer visualized"
  caption="Remember me?"
>}}

It looks like to dereference a pointer, we just follow the green arrow to whatever variable it points to, and then we grab that variable's contents. Super easy!

...

So, how do we dereference `y` in the code?

We simply use the **dereference operator:** `*`

Here's some basic dereferencing in action:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p = &y; // p points to y

    cout << y << endl; // Read y to get its value
    cout << *p << endl; // Dereference p to get the value of y
}
```

The output will be

```
5
5
```

We just accessed the contents of `y` in _two different ways_:

1. _Directly_ through `y` itself
2. _Indirectly_ by dereferencing a pointer to `y`

This is actually a super powerful technique even though our little snippets of code don't make it seem that way.

"Big deal!" you might say. "We already did something similar. Look at this code:"

```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 5; // i is initialized to j
    int j = 5; // j is initialized with i

    cout << i << endl;
    cout << j << endl;

}
```

It prints out

```
5
5
```

just like the pointer, what's so special?

Well each variable corresponds to a _unique_ chunk of memory, so that snippet of code can be visualized like this:

{{< figure
  src="/images/pointer-basics/ij.png#c"
  alt="Two variables initialized with the same value"
  caption="Two variables initialized with the same value"
>}}

`i` and `j` refer to two _different_ `5`'s while `y` and `p` referred to the _same_ `5`!

To drive the point home, look at this snippet of code:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p = &y; // p points to y

    int i = 5; // i is initialized to j
    int j = 5; // j is initialized with i

    cout << " y = " << y << endl;
    cout << "*p = " << *p << endl;
    cout << " i = " << i << endl;
    cout << " j = " << j << endl;

    cout << endl;

    int y = 100; // Update y
    int i = 100; // Update i

    cout << " y = " << y << endl;
    cout << "*p = " << *p << endl;
    cout << " i = " << i << endl;
    cout << " j = " << j << endl;
}
```

The output will be

```
 y = 5
*p = 5
 i = 5
 j = 5

 y = 100
*p = 100
 i = 100
 j = 5
```

When we updated `y`, `*p` got updated as well because `p` points to `y`. But when we updated `i`, `j` stayed the same because `i` and `j` refer to different locations in memory.

So a pointer is much more powerful than copying variables around!

Note that dereferencing returns data, and we can assign that data to another variable or initialize another variable with it:

```cpp
#include <iostream>
using namespace std;

int main() {
    int y = 5;
    int* p = &y; // p points to y
    int z = *p; // Assigning the contents of y to z using p

    if (y == z) {
        cout << "it worked!" << endl;
    }
    else {
        cout << "everything i know about c++ is wrong" << endl;
    }
}
```

If you run that code, you will see `it worked!` printed out.

...

Let's think again about data types. When we dereference a pointer, what do we get back?

Since the  type of `p` is `int*` (pointer to `int`), when we dereference it, we get an `int` back.

If we dereferenced a `char*` we'd get a `char` back, if we dereferenced a `double*` we'd get a `double`, and if we dereferenced a `bool*`... well you can imagine what we get.

With that in mind, here's a fun question, can we dereference a `int*` into a `char` like so?

```cpp
#include <iostream>
using namespace std;

int main() {
    int w = 64;
    int* p = &w; // p points to w
    char c = *p; // Is that legal?
    cout << "c = " << c << endl;
}
```

Weirdly enough, if you run that code, you'll see that you can! The output of the program is

```
c = @
```

I'll leave it up to you to figure out what's going on... 😏

<div class="aside">

Why did that code work?

`p` points to `w`, so dereferencing `p` gives us `64`. Dereferencing `p` into `c` means we're trying to assign the integer `64` to the `char` variable `c`. Since an `int` can be _implicitly converted_ to a `char`, this is a legal operation.

`char` and `int` are converted back and forth using the ascii table. According to the table, `64` is the ascii value for the `'@'` character, which explains the output.

</div>

...

Phew, that certainly was a lot! However, we're not done with dereferencing yet. Turns out we can do more than just read with dereferencing...

### Writing With Pointers

...we can write as well! <span class="hl">Assigning to a dereferenced pointer means assigning to the pointee.</span>

We're going to focus on this example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int t = 15;
    int* p = &t; // p points to t

    cout << "t before = " << t << endl;

    *p = 23; // Write to t by using p

    cout << "t after  = " << t << endl;
}
```

Lines 5 and 6 establish `p` as a pointer to `t`. Line 10 assigns `23` to the pointee of `p`. Since `p` points to `t`, we are essentially assigning `23` to `t`.

Running that little bit o' code prints:

```
t before = 15
t after  = 23
```

We just modified the contents of `t` without using `t` at all!

{{< figure
  src="/images/pointer-basics/meme.png#c"
  alt="A topical meme"
  attr="© Nickelodeon (please don't sue me)"
>}}

Of course, this seems highly unnecessary when we could have just done `t = 23`, but indirectly modifying variables is pretty cool and useful in other less contrived contexts.

A good question at this point would be, what data types can we write? For instance, is the following valid code?

```cpp
#include <iostream>
using namespace std;

int main() {
    int t = 15;
    int* p = &x;

    cout << "t before = " << t << endl;

    *p = 6.9f; // Is that legal?

    cout << "t after  = " << t << endl;
}
```

If you run that bit o' code, you'll see that it is indeed valid. This is the output:

```
t before = 15
t after  = 6
```

The code compiles and runs because a `float` can be implicitly converted to an `int` just by chopping off the fraction part (although the compiler may warn you that it is doing so).

In general, if the thing you're assigning can be implicitly converted to the type you're trying to assign to, then you won't get a compiler error.

...

Now, we're gonna talk about the bane of all C/C++ programmers...

## NULL POINTERS

All of the pointers we've created have pointed to something, but can we have a pointer point to... nothing?

Why, of course we can! A pointer that contains an address of `0` is known as a **null pointer**, and it points to nothing.

Pointing to nothing means that there is no data at the address contained in the pointer. In fact, if you try to dereference a null pointer for either reading or writing, you get an error and your program will certainly crash. Run this code if you want to see for yourself:

```cpp
#include <iostream>
using namespace std;

int main() {
    int* p = 0; // A null pointer!
    cout << *p << endl; // Bad!!
}
```

Running it gives the dreaded `segmentation fault`.

...

We can declare a null pointer by assigning `0` to `p`, but there are better ways.

In C and C++ before 2011, programmers would assign the macro `NULL`, declared in either `<stddef.h>` if you're using C or `<cstddef>` if you're using C++. It would look like this:

```cpp
#include <iostream>
#include <cstddef> // Import the NULL macro
using namespace std;

int main() {
    int* p = NULL; // A null pointer!
}
```

In C++11 and beyond however, it is recommended to instead use the keyword `nullptr` like so:

```cpp
#include <iostream>
using namespace std;

int main() {
    int* p = nullptr; // A null pointer, the modern C++ way!
}
```

Note that `p` still has an address of `0`.

You might wonder if it results in the same thing as assigning `0`, why use it? Out of laziness, I'm gonna outsource the explanation to [this StackOverflow post](https://stackoverflow.com/questions/13816385/what-are-the-advantages-of-using-nullptr).

We're gonna stick with the C++11 way since I'm writing this in 2020.


Here's how we'll visualize a null pointer:

{{< figure
  src="/images/pointer-basics/null_ptr.png#c"
  alt="A null pointer visualized"
  attr="Pointing to nothing, what a sad existence"
>}}

That ∅ is the [null sign](https://en.wikipedia.org/wiki/Null_sign). Quite fitting for our purposes.

...

We need to come up with a way to avoid the bad consequences of null pointers. For example, this code from earlier crashes because we dereference a null pointer:

```cpp
#include <iostream>
using namespace std;

int main() {
    int* p = 0; // A null pointer!
    cout << *p << endl;
}
```

How can we check that the pointer is _not_ null before calling `cout`?

Give it a thought, if you need help, there's a hint below...

<div class="aside">

Hint for detecting a null pointer

What value do null pointers contain?

</div>

<div class="aside">

Answer to detecting a null pointer

Remember that a null pointed contains an address of `0`, so to test if a pointer is _not_ null, we just need to check that it _doesn't_ contain the address `0`!

```cpp
#include <iostream>
using namespace std;

int main() {
    int* p = nullptr; // A null pointer, the modern C++ way!
    if (p != 0) {
        cout << *p << endl;
    }
}
```

That code will successfully detect that `p` is null and will not dereference it, thus avoiding a segmentation fault.

We can simplify that code by noting that `0` converts to `false`, and every other number implicitly converts to `true`. So if the pointer contains _anything_ but `0`, i.e. if it's not null, it's address implicitly converts to `true`. The `==` operator does the implicit conversion for us, so we can write

```cpp
    if (p == true) {
        cout << *p << endl;
    }
```

which of course further simplifies to


```cpp
    if (p) {
        cout << *p << endl;
    }
```

This is what you'll come across more often in the wild (aka other peoples' code).

I suppose it's worth noting that comparing with `nullptr` also works:


```cpp
    if (p == nullptr) {
        cout << *p << endl;
    }
```

This is the most verbose option, but it's semantically the clearest option. Suppose I showed you this (made-up) code out of context:

```cpp
    if (!pxy_23f) {
        ...
    }

    if (head == 0) {
        ...
    }
```

Is `pxy_23f` a boolean flag? Is `head` an integer? Sure most code editors have features that would tell you what type those variables are pretty quickly, but if I wrote

```cpp
    if (pxy_23f == nullptr) {
        ...
    }

    if (head == nullptr) {
        ...
    }
```

you'd immediately know that those thingies are pointers and we're checking to see if they're null.

Now personally, I'm gonna use the `if (!p)` syntax for brevity. But I wanted to present to you all the options.

JK I'm hardly ever gonna check whether pointers are null throughout this series... 🙈

</div>

## Pointers and `const`-ness

You may already know the `const` keyword, but in case you don't, here is a quick recap: a `const` variable is one whose contents cannot be modified. The variable is **read-only**, you can't write to it.

{{< figure
  src="/images/pointer-basics/meme2.png#c"
  alt="Another topical meme"
  attr="Read only means read👏only👏<br>Again © Nickelodeon (please don't sue me)"
>}}

Here's a small snippet to demonstrate:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    const int k = 7;   // READ ONLY

    cout << x << endl; // Reading x -- OK
    x = 23;            // Writing to x -- OK

    cout << k << endl; // Reading k -- OK
    k = 91;            // Writing to k -- ILLEGAL!!
}
```

The line `k = 91` will give you a compiler error.

What's (kinda) neat is that `int const x` and `const int x` mean the same thing. Moving the `const` keyword like that doesn't change anything!

Note that `int x const` is not valid syntax however. `const` is part of the type of `x`, and so it must be to the _left_ of the variable name.

Now, what does `const` mean in terms of pointers?

When it comes to pointers, there are **3 places** you can put the `const` keyword:

1. `const int* p`
2. `int const * p`
3. `int* const p`

_(I'm just using `int` as a placeholder data type. Of course the following discussion is valid for `bool`, `float`, etc.)_

Placements 1 and 2 are equivalent and refer to the fact that the pointer treats the pointee as constant. Despite the fact that they're the same, I gotta admit that I _overwhelmingly_ prefer Placement 1 😁 Most code I've seen uses Placement 1 as well.

Placement 3 means the pointer itself is constant. We will go into further detail for both cases.

### `const` Pointee

As stated earlier, `const int* p` and `int const * p` mean the same thing: `p` treats the chunk of memory that it _points to_  as read-only.

Put another way, it means we can dereference `p` to _read_ the pointee, but we can't use `p` to _modify_ the pointee.

This prevents you from writing code like this:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 82;
    const int* p = &x; // A pointer with a const pointee
    *p = 29; // ILLEGAL!!
}
```

Note `x` is non-`const`, meaning we could do `x = 29` no problem. However since `p` is a `const int*`, we can't do `*p = 29`.

It's worth hammering this point home: `p` being of type `const int*` does **NOT** mean that the pointee is `const`. `x` is the pointee and `x` clearly isn't `const`. `p` being of type `const int*` means that `p` _treats_ the pointee as `const`. It's basically `p` making a promise to `x` that it will only observe `x` and never modify it.

Now, let's tweak the visuals to account for this `const`-ness. This is a good way I think:

{{< figure
  src="/images/pointer-basics/const_ptee.png#c"
  alt="A lock on the arrow from p to x indicates that we cannot use p to modify x"
  attr="A lock on the arrow from p to x indicates that `p` has a `const` pointee"
>}}

That blue thing is meant to be a lock... I'm not exactly the greatest artist in the world 😅

Remember that the arrow signifies the relationship between `p` and `x`: `p` is a pointer to `x`, and `x` is the pointee of `p`. We have seen previously that this relationship can generally be used to observe the pointee or modify it. The lock on the arrow indicates that we can still use the relationship between pointer and pointee to observe, but not to modify.

### `const` Pointer

`int* const p` means that the contents of _`p` itself_ is read-only. The contents of `p` determine where it points. Thus, if we cannot change the contents of `p`, then we cannot change _where_ `p` points.

Even though we can't change where `p` points, we _can_ change the _thing_ that `p` points _to_. This example should clarify things:

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 82;
    int* const p = &x; // p points to x and we can't change this!
    *p = 29; // Modifying x to contain 29 -- OK!

    int y = 1; // Another variable
    p = &y; // Making p point somewhere else -- ILLEGAL!!
}
```

We can represent a `const` pointer like so:

{{< figure
  src="/images/pointer-basics/const_ptr.png#c"
  alt="A lock on contents of p indicate that they can't be changed, i.e. p cannot point to anything else"
  attr="A lock on the contents of `p` indicates that `p` is a `const` pointer"
>}}

The blue lock on the contents of `p` indicates that we may observe the contents of `p` (i.e. we can read it), but we may not modify them. Since the contents control where `p` points, this is akin to saying that we may not change where `p` points.

<div class="aside">

Comparing this to normal variables

You might be tempted to think that this is a type of `const`-ness you don't get with normal variables. However, I would argue that isn't true. Remember that when you declare a variable, it basically assigns a name to a chunk of memory.

You don't get to then change what chunk of memory the name is attached to. If I declare `int x` and the address of `x` turns out to be `0x59`, then as long as the variable `x` is in scope, it will be assigned to address `0x59`. This is a lot like a `const` pointer!

So having this second way to use `const` isn't an extra degree of flexibility for pointers. Rather the ability to not have to use `const` this way is the freedom awarded to pointers.

</div>

### Remembering Where to Put the `const`

If you're like me and your memory isn't so hot, there's a pretty intuitive way to think about the relation between where the `const` goes and what type of `const` the pointer is. Even if your memory is super good, I'd say this is helpful because rote memorization is boring 😛

Remember that `int* p` means that `p` is a pointer to an `int`. That `*` is like a fence that separates `p` (the pointer) and `int` (the pointee).

If the `const` is to the _left_ of the `*` like in `const int* p` or `int const * p`, then that `const` is on the `int` side of the fence. That means that the `int` aka the _pointee_ is `const`.

If instead the `const` is to the _right_ of the `*` like in `int* const p`, then that `const` is on the `p` side of the fence. That means that `p`, or the _pointer_ is `const`.

### Combining Placements

You might be feeling greedy and wonder if you can have multiple `const` keywords in a single declaration. The answer is that you most certainly can!

You can write something like `const int* const p`. In this case, we can _neither_ change _where_ `p` points _nor_ the _thing_ it points _to_. Once again, a small snippet will clear things up:

```cpp
#include <iostream>
using namespace std;

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

We also have a pretty good way to visualize them which will make tackling complex topics easier!

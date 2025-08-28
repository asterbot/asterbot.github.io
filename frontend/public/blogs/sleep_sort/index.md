# Preface
---

Find all code used in the jupyter notebook here: [INSERT-LINK-HERE]

# Introduction

---

I'm not entirely sure how I stumbled on to this, but I found out that long ago some 4chan user claimed to have created a $O(n)$ sorting algorithm. Here is the original thread:

![Screenshot of 4chan thread](./img/image.png)

The main idea is that you sleeo for the amount of time represented by the item in the array. So the smaller elements get in the result faster, and hence in sorted order!

Converting the bash code to pseudocode, this is what it roughly translates to:

```python
sort(L):
    for each element x of L:
        create this background process:
            sleep for x seconds
            print x
```

Genius, right? If you input `3 1 2` this is what would happen:

```python
time(s):   0            1            2            3
           <--------------sleep-------------->  print(3)
           <-sleep->  print(1)    
           <--------sleep--------> print(2)        
```
As you can see, the numbers printed in order! Hooray! Nice sorting! Or is it?

# Aside: How fast can sorting be?

---

One fact echo'd almost everywhere about sorting is that the best you can do is $O(n \log n)$. This is true for **comparison-based** sorting.

## Comparison-based sorting
This is the type of sorting which involves directly comparing elements of the original array with one another, and it has been proven that this cannot go faster than $O(n \log n)$. 

<details>
<summary>A small proof</summary>

An array with $n$ items can have at most $n!$ arrangements (or permutations). \
In a comparison-based sorting algorithm, we must perform **at least** $\log (n!)$ comparisons.
> The reason for this is that each "comparison" is essentially a yes/no decision about which element to chose, so the question can be reframed as: _how many comparisons do I need to uniquely identify the right permutation?_\
> If you can make $d$ yes/no decisions, the number of possible outcomes is $2^d$\
> We also know the total number of possible outcomes is $n!$, so $2^d\; = n! \implies d = \log (n!)$

Also, \
$\log(n!) = \log(n) + \log(n-1) + \ldots + \log(1) \le \log(n) + \log(n) + \ldots + \log(n) = n \log(n)$ \
$\implies \log(n!) \le n \log(n)$

So the lower-bound of comparison-based sorts is $\Omega(n \log n)$ in the worst case
</details>


## Non-comparison based sorting
While it is true that most basic sorting algorithms cannot be faster than $O(n \log n)$, there are certain algorithms which can go as fast as $O(n)$ (eg. Bucket Sort and Radix Sort. Look them up!)

So why aren't these the hero sorting algorithms? The answer is simple: *they make a lot of implicit assumptions* and *work well in very specific cases!* 
- Something like Radix sort consumes a lot of memory and is generally less flexible as it is based on digits and letters
- Something like Bucket sort works the best when data is more-or-less evenly distributed. 

And both of these could go as bad as $O(n^2\;)$ if their assumptions aren't met - however, what is true that these algorithms can and will be used when they fit best!

# Back to sleep sort
---

Sooooo is sleep sort better than all the algorithms seen before?? Is it really $O(n)$? To get into this, I want to deep dive into the OS details of why this isn't as good and do some numerical analysis.

## Problems

### Waiting `x` seconds

Could be insanely high in terms of *seconds*, forget time complexity. If an element is 1000, it's a 16 minute wait! Merge sort would never!


*MAYBEEEEE* - For array `L`, using scaling factor to scale `x` to `x / max(L)` to bring everything in `[0,1]` $\to$ shorter wait times??
- Well, yes, but now you've lost correctness. If this worked as theoretically stated, we could scale it down even further and get super low run times! 
- The problem is that computers can normally not guarantee sleep times with accuracy more than 1ms

So there is a small implicit assumption here! We need all scaled down numbers to be less than 0.001 (which represents 1ms). This can be guaranteed in arrays $L$ which have:
$$
\dfrac{\min(L)}{\max(L)}\;\;\;\;\;\;\;\;\;\;\;\; < 0.001
$$

Look at the [jupyer notebook](insert-link-here) and see how this innacuracy plays out!


### Thread memory overhead
Each thread allocates its own stack in virtual memory allocated for it - could theoretically go really high. Depending on the system, the stack size of a thread could be up to 4MB. $^{[1]}$ \
This means that for an array of 1000 elements, it could take up to 4GB of memory! It scales linearly, and can go up to 40GB for 10000 elements! That is completely unreasonable in terms of space complexity for a sorting algorithm.

### Context switching

Switching between threads requires context switching which is expensive. The more threads that run `sleep(x); print(x)`, the more context switches are required to give the illusion that they all ran concurrently. 
> We need context switches so that when we return to a thread, it knows where to continue from.

Consider two threads $T_a\;$ and $T_b\;$ which are performing sleep for $a$ and $b$ seconds respectively. Assume $T_a\;$ is running. These steps will occur during a context switch:
1. An interrupt occurs where the OS scheduler decides it's time to pause $T_a\;$ and $T_b\;\;$ should run.
2. The system pauses $T_a\;$, which involves saving the current state of $T_a\;$ (register values, program counters, ...) into a **Thread Control Block(TCB)**, call it $\text{TCB}_a\;\;$ - you can think of this as encoding how much time has passed with that thread running.
   - The OS needs to do this so that when it runs $T_a\;$ again, it knows how to resume it correctly. 
3. The OS retreives the state of $T_b\;$ from its TCB (call it $\text{TCB}_b\;$) and restores the thread from its last save point, which you can think of as encoding how many seconds had already passed in prior runs of $T_b\;$.
4. Now $T_b\;$ runs while $T_a\;$ is idle.
5. Now the OS scheduler decides to interrupt $T_b\;$ and run $T_a\;$ - it retreives the last saved point of $T_a\;$ from $\text{TCB}_a\;$ and runs it from there. 

Hooray! They're running concurrently! \
![I've won... but at what cost? meme](img/image2.png)

- The memory overhead arises from the TCB's that need to be saved and restored over and over - they are saved in the memory of the computer
- The time overhead arises from the OS's scheduling algorithm, which is certainly not negligible if the number of threads are large!


Now, ask yourself: is it worth asking your OS to do ALL this over and over to sort even just an array of 5 numbers? Didn't think so.

# The time cost comparison
---
After some intense scientific research (wrote some code) to find out how slow or fast sleep sort can be (I just ran it and measured it in Python), here are my results! I tested 3 functions:
1. Python's in-built `sorted` function 
2. `sleep_sort()` - which implements the sorting algorithm originally created by the 4chan user
3. `scaled_sleep_sort()` - which was implemented by the scaling method discussed earlier of scaling all elements down to `x/max(L)` and waiting that long. I used only valid array inputs.
    - As discussed in the earlier, valid inputs for this are those where `max(L)/min(L) < 0.001`, since `sleep` works accurately when the sleep time is 1ms or higher.


I ran all 3 of them with the input array `[5,3,1,2,4]` and the results were:
 
| Algorithm | Time (seconds) |
|-|-|
|Python's `sorted` |  $1.525 \times 10^{-4}$  |
|`sleep_sort` | 5.006 |
|`scaled_sleep_sort` | 1.002 |

Check out the Jupyter Notebook to see how I measured and implemented these!

Even with using the scaling optimization, it is not even close to the run time of faster sorting algorithms, even for such small inputs! 



# Wrap up
---
I may have slightly click-baited you at the start there - the 4chan user never explicitly said this was $O(n)$; the rest of the internet did after they posted this.
Some people argued that the time complexity is actually $O(n \cdot \max(L))$ (since each thread waits upto `max(L)` seconds!), others brought up the point with threads that I did.\
While studying this case, there are some things I think one can take away from this to become a better computer scientist:
1. **Time complexity isn't everything!** Just because something has a shiny runtime doesn't mean it's not hiding things! Always try to understand whether the time complexity is in a general-case or if it has hidden assumnptions.
2. **Threads aren't free!** Most applications nowadays run on multi-threaded concurrent programs, and while they offer a really cool abstraction for running things concurrently, it's important to always consider the cost of these!
3. **Meme case study?** While this case study was picked up from a 4chan thread of all places, and it isn't even in a credible algorithm, sometimes analyzing bad algorithms and doing a deep dive is what gets you to learn new things!  

# Sources
---
1. **Linux thread creation:** https://man7.org/linux/man-pages/man3/pthread_create.3.html
2. **Accuracy of python `time.sleep`:** https://stackoverflow.com/questions/1133857/how-accurate-is-pythons-time-sleep

> PS. if you read this blog, thank you! I'd appreciate any feedback or thoughts if you'd like to share them :D Feel free to connect with me wherever!




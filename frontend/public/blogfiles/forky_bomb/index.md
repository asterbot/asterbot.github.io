## Intro

For those of you who use bash shells, please believe me when I say that you <u>**should NOT**</u> run this:

```bash
:(){:|:&};:
```

What on earth is going on? Let's figure it out together! 

## What is this command doing?

This command, very confusingly creates a function named `:`. I will re-write this with a function named `f` and some clear formatting:

```bash
f(){
    f | f &
};

f # this is function call
```

Clearly, this function is recursive. In fact, it is doubly recursive ($2^n$ function calls at depth $n$)


Every call to `f` immediately spawns two more copies of itself (one on each side of the pipe) in the background, so the number of running processes doubles at each step:

```mermaid
flowchart LR
    subgraph T0["t = 0: 1 process"]
        a["f"]
    end
    subgraph T1["t = 1: 2 processes"]
        b1["f"]
        b2["f"]
    end
    subgraph T2["t = 2: 4 processes"]
        c1["f"]
        c2["f"]
        c3["f"]
        c4["f"]
    end
    subgraph T3["t = 3: 8 processes"]
        d1["f"]
        d2["f"]
        d3["f"]
        d4["f"]
        d5["f"]
        d6["f"]
        d7["f"]
        d8["f"]
    end
    subgraph Tn["t = n: 2ⁿ processes"]
        e["KABOOM"]
    end

    a --> b1 & b2
    b1 --> c1 & c2
    b2 --> c3 & c4
    c1 --> d1 & d2
    c2 --> d3 & d4
    c3 --> d5 & d6
    c4 --> d7 & d8
    d1 & d2 & d3 & d4 & d5 & d6 & d7 & d8 -.-> e
```


dang
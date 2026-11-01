
I want to write about what it was like to be on the teaching side at UWaterloo. I often call this experience one of the most influential experiences in my early career and I fondly look back to it. For a long time it was my favorite co-op experience and I really miss teaching.

First things first: I was working in a role called **ISA (Instructional Support Assistant)**. If you haven't heard that term before, it's basically an undergraduate TA, and it's the term UWaterloo uses for undergraduate TAs in the CS department. I got to work directly on the frontline, talking to students, working with profs and generally getting to help in the process of how courses are run. All good fun! 

I was teaching a course with the code [CS136L](https://uwflow.com/course/cs136l) and often helping out with [CS136](https://uwflow.com/course/cs136). These courses are there to help first years get familiar with C programming, using some cool data structures and algorithms, and the lab course is to help students get better at learning some very important tools for being a good developer (eg. bash, Makefiles, debugging tools, C/C++ preprocessors kinda stuff) and in my opinion that sets students up for success if they take the course seriously enough. 

## Thoughts on teaching during this time

I did this back in January-April 2024, which feels like forever ago. I had done a bit of volunteering teaching here and there, and a bit of non-volunteering teaching work, but that's not important here.

In terms of teaching things in Math/CS, I feel like a big part of learning these kinds of subjects is being able to feel like you could've discovered it by yourself. I really love the "aha!" moments I get when I figure something out which I found relatively complex, and that's the kind of experience I hope I was able to give the students I taught (shoutout 3B1B!). While this sounds great in theory, I was often trying to figure out how to even give a hint that doesn't give the answer but does guide them in the right direction. It is a skill I had to learn, which forced me to understand the content a lot better. I do think a true testament to how well you understand something is if you can explain it to someone with no prior context on it, and I really appreciate that I was constantly challenged on that skill :)

## Non-teaching things I did that co-op

So strangely this was also a pretty software *development* heavy co-op. UWaterloo uses an auto-grading system to mark student submissions (aka [Marmoset](https://marmoset.cs.umd.edu/)) in the lab and in the course, where the students submit their solution files to the university servers and some grading scripts assign them a score. 

Before I *worked* on this system I was really fascinated by how it worked. You just submit a file, and boom, you got a score! I think this was a major wow moment for me since in high school the teachers would just read the code you submitted to grade it (which, I mean, fair!). Before I learned how this system worked, this kinda felt like magic, so being able to actually work on this system was so insanely cool to me. Quite often I would just volunteer to take on doing things for running this backend of the course smoothly, and I'm really happy that instructors gave me so many chances to help out and improve their system (shoutout Nomair!)

The way a lot (but not all) grading scripts worked was basically:
```bash
#!/bin/bash

STUDENT_SUBMISSION=...
SAMPLE_SOLUTION=...

for test in ${TESTS}; do
    run $SAMPLE_SOLUTION $test > expected.txt
    run $STUDENT_SOLUTION $test > student.txt
done

CORRECT=$(diff expected.txt student.txt)
```
It wasn't anything more, but I still found it really interesting. I think that's when I realized the true power of software; the most simple kinds of programs can give such impactful experiences - in this case to instructors and students! As a student it was really nice to be able to get immediate feedback on your code for correctness and keep debugging until you figure it out, and I'm sure this was a game changer for instructors who had to read student codes (I assume?)


## Random memories

A bit more context: ISA's are a part of this group called the Instructional Support Group (ISG) which is the team at UWaterloo which handles logistics for running a lot of courses. They have [ISAs](https://uwaterloo.ca/computer-science-instructional-support-group/about/instructional-support-assistants) (which is the role I worked) and I loved interacting with all other ISAs and doing a lot of fun social events! A lot of them from my term (including me, as of writing this blog) are on [this website](https://uwaterloo.ca/computer-science-instructional-support-group/about/instructional-support-assistants) (try to find me!). These pictures came to be since we were doing a photoshoot for the ISG website

This is one of the pics from that photoshoot!

![](https://uwaterloo.ca/computer-science-instructional-support-group/sites/default/files/styles/uw_is_ig_x_large/public/uploads/images/25.png?itok=pYQOX6XO)

Thank you for reading! 

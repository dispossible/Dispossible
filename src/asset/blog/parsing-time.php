<p>
    I have just fixed a long standing bug in my code for canvas animations in JavaScript, so I wanted to have a look at what the issue was and how I finally fixed it.
    I feel my solution will also improve on my support for less powerful machines that run at low frame rates or skip frames.
</p>

<h2>
    What does my code do?
</h2>

<p>
    The code in question is the canvas animation currently running on this sites <a href="/">homepage</a> which is an array of particles drifting across the screen.
    As far as particle animations go, it's pretty basic on the whole only using simple distance over time calculation, but it does what it needs to do.
</p>

<p>
    Part of my code involves adjusting the animation with varying frame rates.
    What this means in practice is that I'm not moving each particle a fixed distance, say 5 pixels per frame, I am instead moving a distance based on the amount of time that has elapsed since the last frame.
    So if the gap between each frame is longer (i.e. lower frame rate) then the animation will move in larger jumps to counteract this, which allows the particles to move at the same perceived speed at all frame rates.
</p>

<p>
    Under the hood my code was storing the time that the current frame was rendered, and then in the following frame I take that time away from the new current time and this will give me the time difference since the last frame.
    This is called the frames "Delta".
</p>

<h2>
    What was the issue?
</h2>

<p>
    For the most part my animation was running smooth as could be.
    However if I swapped to another browser tab for an amount of time and then returned, all of my particles had disappeared from the screen.
    At this point my garbage collector script picked up all of the particles as being outside of the render area, spliced them out of the array and spawned new particles heading into view.
</p>

<p>
    Something was happening to all of my particles when I wasn't looking, which was puzzling mainly because my animation shuts off and doesn't update anything while the page is hidden and then resumes on refocus.
    So where did they all go?
</p>

<p>
    The two key facts here are; how I was adjusting my animation to match frame rate via the delta, and also that the browser paused my animation when defocused.
</p>

<p>
    A result of these two facts is that the first frame that tries to render following the tab regaining focus has had a huge amount of time pass since the last frame.
    At this point my code realised that the delta it calculated meant that all of the particles should have moved hundreds of pixels since the last frame.
    On the face of it that shouldn't be a problem, but as all of those intervening frames hadn't run, my garbage collection had not been curating the particles as they left the visible area.
    Meaning that all of the current particles had made a huge amount of progress out of the visible area without being deleted and new ones created.
    The end result being that that first frame after refocus had nothing left in sight to render.
</p>

<h2>
    The fix
</h2>

<p>
    So what this came down to was that at <strong>really</strong> low frame rates my physics did their best to calculate correctly, but any supporting functions that held everything together were missing out.
    To fix this I simply locked off the lowest possible frame rate, so if more than 300ms has passed since the last frame then the delta would be locked to that maximum.
</p>

<p>
    With this in place any major frame stuttering or drops will never cause the system to become unstable and the physics calculation will actually slow down to allow for the infrequent frames.
    Now you may notice this goes against what I said in the opening paragraph that I wanted my animation to remain at the same speed regardless of frame rate.
    But I feel that after the frame rate has dropped to over 300ms between frames, still calling it an animation is generous and at that point it is more coherent to let the slow down occur.
</p>

<p>
    In this particular use case it could even be advantageous to detect when the frame rate is consistently below the maximum and stop rendering it entirely, leave a static background of the last frame it did render.
    Another use case that comes to mind would be when running games, as when the users frame rate dropped past the maximum and the game continued to run at the same speed regardless, it would likely result in a frustrating game over.
</p>

<p>
    I hope this insight into my timing problems has been helpful to anyone also interested animations and physics, or just an interesting look into my code problems.
</p>
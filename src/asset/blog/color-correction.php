<p>Being British this post has to first start with an apology. An apology for my spelling, as this post will entirely contain the syntactically correct spelling of colo<del>u</del>r.</p>

<p>Now what I actually wanted to talk about was the four color syntaxes available in CSS, how they work, and my feelings on how useful each one is in what situations.</p>


<h2>Color Names</h2>

<code class="code codeCss">color: BlueViolet;</code>

<p>Our first syntax is pretty strait forward; write down the name of the color you want. At the time of writing there are around 140 color names that can be used, ranging from the simple Red, Green or Blue, to more complex colors like MediumSpringGreen or DarkSlateBlue. If you would like to find a full list of color names then <a href="https://css-tricks.com/snippets/css/named-colors-and-hex-equivalents/" target="_blank">css-tricks has the post for you</a>.</p>

<p>Off the bat this seems like a really easy syntax to work with, but quickly it becomes a job of trying to remember any of the names beyond the simple base colors. The second issue I find in this syntax is that while 140 colors is a fair amount of choice, it doesn't give you anything like the range that a modern screen is capable of displaying. Nor is it a simple matter to make a color you already have written down slightly darker or lighter.</p>

<p>So where can this syntax really shine? I find that the major strengths of this syntax are in prototyping or code demos, when the actual colors of the element are placeholders. When I am putting together a layout and I just need that element over there to be red, I don't mind what shade of red right now, just make it red so I can see it and work with it. Using the color name is super quick and I don't need to think about it or go look up anything in a color picker, I've written it in and we're good to go.</p>

<p>Something else that likes this syntax is my complier. Specifically the CSS minification where if you have used another syntax in your source file, it could be that it is less characters to use a color name. For example if you had used a hex value of '#FFC0CB' then the compiler could swap that out to be 'Pink' which is a saving of 3 characters. While this doesn't affect how you code or even view your site, it is something happening under the bonnet saving you a few bytes of download time, and we can all be grateful for that.</p>


<h2>Hex</h2>

<code class="code codeCss">color: #8a2be2;</code>

<p>From my experience hex colors are the most widely used syntax around the web, and I would argue it is also the most complex to understand.</p>

<p>While it is true that you can use a color picker and get the exact hex value you want, it means that if ever you need to tweak that color you will need to go back into the color picker and reselect the color. Some IDEs/text editors have added built in color pickers, and even tools like browser code inspectors are adding this feature. However I still feel it is a valid issue that when glancing at a hex value it is exceedingly difficult to be able to say what color or even shade I am looking at without a visual guide, and then if I wanted to tweak that color it is also very tricky to understand what my changes to the code will do to the final color.</p>

<p>Fair warning; the next paragraph involves maths, feel free to skip it if that sounds scary&hellip;</p>

<p>So how do hex values actually work? First off the # prefix can be ignored, that is just there to specify the syntax. That leaves us with 6 characters, or occasionally 3 characters when written shorthand which can be converted back to 6 characters by writing each character twice. These characters will always be between 0 and F and are not case sensitive. These 6 characters are then split up into 3 pairs, so '#8a2be2' will become '8a'-'2b'-'e2', each of these pairs represents an amount of Red - Green - Blue. These values are however written in <a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank">Base16</a> (also know as Hexadecimal, giving this syntax it's name), which when converted into Base10 (Decimal) gives you values between 0-255. Base16 is used because it requires only a single byte of data, and gives the browser less work to do to get your color on screen. So now we can begin to tweak our hex values with some degree of control, by increasing or decreasing the Red, Green or Blue amounts which are <a href="https://en.wikipedia.org/wiki/Additive_color" target="_blank">additively mixed</a> to give us the final color.</p>

<p>Given the complexity of reading and editing a hex color by hand then in my view this make them very hard to use in code, and requires the use of a color picker which slows down coding. As the syntax is based on editing additive values of Red, Green and Blue this also means that making a seemingly simple change to say the brightness of a color, which would be a common tweak while designing, requires changing the entire hex value.</p>

<p>Something that hex does have going for it however is compatibility. Every place I can think of that a color could be entered will accept a hex value, be it javascript, SVG, or CSS, and browser support is universal.</p>

<p>On much the same note as color names, hex values are also very good for compilers and getting your code into as few characters as possible. For simple colors it can be a close call between the color name and the hex as to which is shorter, but for more complex colors and colors that do not have names (given that hex has around 16.7 million colors verses about 140 named colors) then hex is almost always the syntax with the least amount of characters needed to express a given color.</p>


<h2>Red, Green and Blue (RGB)</h2>

<code class="code codeCss">color: rgb(138, 43, 226);</code>

<p>RGB syntax is seemingly a much more verbose syntax for defining a color, where you can directly specify the amounts of each base color that you want to <a href="https://en.wikipedia.org/wiki/Additive_color" target="_blank">additively mix</a> to make your final color. If you braved the maths paragraph earlier you may also note that RGB syntax is remarkably similar to hex but with less confusion over numbering systems. RGB uses values between 0 and 255 for each value giving you the same 16.7 million(ish) colors that hex has.</p>

<p>So at first look there isn't a huge amount of reason to use this syntax over hex, bar the simplified numbers, although this syntax is a trade off on character count (though a compiler would negate this by swapping back to hex). RGB does suffer similar drawbacks to hex, where making a simple change to brightness would require all 3 values to be altered and is usually easier to use a color picker to make your changes than trying to work out the alteration in your head.</p>

<p>Something RGB has over hex however is that it can support Alpha (aka semi-transparency) via the RGBA syntax, with the drawback of losing support for IE8. Personally I feel this is an acceptable loss and there are always fall-backs that can be used if you must have IE8 support. Having an Alpha however is a game changer and allows for far more complex designs and element interactions on your page. The Alpha is a forth number added to the end of the RGBA and is between 0-1, which is really easily visualised as a percentage of visibility, for example 0.5 is 50%, 0.75 is 75% and so on, making editing the Alpha very quick and simple to do by hand.</p>

<p>Personally I don't find many reasons to use the RGB syntax over hex, as both really require a color picker to get precise control. However the addition of Alpha in the RGBA syntax is an excellent reason to use RGBA over hex.</p>


<h2>Hue, Saturation and Lightness (HSL)</h2>

<code class="code codeCss">color: hsl(271, 75%, 52%);</code>

<p>Our final syntax is in my experience the least used syntax, and I feel that is unfairly so. On face value HSL syntax looks much like that of RGB but with different letters, which syntactically is mostly true, but that really is where the differences end.</p>

<p>The best way to describe the workings of HSL is to visualise a color wheel, the Hue value which is between 0 and 360, is the amount of degrees (starting at red) around the color wheel the hue of our color is. This is probably the most difficult part to work out but I feel this is at least easier than trying to work out the mix of Red, Green, and Blue values mentally. The last 2 values which are both written as percentages work exactly as you would expect them to, by altering the percentage of Saturation and Lightness of the selected Hue.</p>

<p>I find that HSL is a good deal easier to understand than a hex or RGB color at a glance, as all of the values match up with how you would naturally think about and visualise colors. Making a HSL darker or lighter is as easy as changing the Lightness percentage to reflect the change you want to see. There is no need to swap over to a color picker because the values of an HSL are the same as the sliders you would expect to see in a color pickers UI.</p>

<p>HSL does suffer the same fate as RGBA with a lack of IE8 support, however as I said in regards to RGBA, I find IE8 is an acceptable loss given the advantages of the syntax, and can be dealt with using a fall-back or just having a complier that swaps the color out for a hex value. The reason not to simply have a hex value in the source file however is the ease of use when tweaking the color and the complier does the legwork of swapping over to a hex value from your HSL.</p>

<p>As with RGB, HSL can also be extended to include an Alpha value using the HSLA syntax, allowing for transparent colors. The HSLA Alpha syntax is in the same format as the RGBA where the Alpha is a value between 0 and 1, which remains simple to understand without a color picker, as the value is (essentially) a percentage.</p>


<h2>Conclusion</h2>

<p>I believe that hex colors still have their place for legacy support and for compilers to save you some precious bytes, and there is also a place for color names in the situations where you just want a quick simple color without any need for precision. The RGB syntax however I'm less inclined to use given it's similarity with hex, albeit with simpler maths. If RGB works for you however then I've no arguments to dissuade you, but personally I'm happy with hex for my RGB needs.</p>

<p>In the end I'm really here flying the flag for the use of the HSL syntax, because it is readable, and more importantly editable. Having the values in the CSS directly related to how you visually deal with colors on a design basis just makes choosing and manipulating colors simple.</p>
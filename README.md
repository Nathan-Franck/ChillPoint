# ChillPoint

My personal playground while experimenting with Typescript and Web-technologies.

Hosted [Here](https://nathan-franck.github.io/ChillPoint/)

![Chillpoint Showcase](https://raw.githubusercontent.com/TacticalDan/ChillPoint/master/Chillpoint%20Showcase.png)

## Tools/Features in Development

### Util.Shader.ts
Automates a lot of the drudgery of creating new shaders using WebGL, clever typing minimizes mistakes when declaring
shader variables that will recieve data from Typescript.

### Util.HTMLBuilder.ts
Acts as a basic framework for generating and managing HTML DOM objects similar to how ReactJS works,
re-inventing the wheel means my implementation could be generified for things beyond DOM objects [shaders etc.].

### Util.Terrain.ts
Draws Rollercoaster Tycoon-style terrain with the addition of a lovely water/shore shader below a certain height.

### Util.Forest.ts
Can use GPU instancing to draw the same procedurally generated tree model at various stages of maturity.

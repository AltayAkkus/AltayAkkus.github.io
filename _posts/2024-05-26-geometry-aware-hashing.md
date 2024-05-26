---
layout: post
title: Geometry-Aware Hashing of GeoJSON objects
---
While writing a comparator for GeoJSON Feature Collections I encountered an interesting problem:

Whenever you want to compare two (or more) huge lists with each other, you quickly end up using hashes. 

You can associate your objects to an hash, put them in a hash map, and lookup values (in this case, duplicates) in `O(1)` time, resulting in far less computationally expensive operations.

In GeoJSON each `FeatureCollection` (you see this a map, with added Points, Lines, and Areas) contains `Features`, which contain `Geometry`, which in the case of `LineString` and `Polygon` are a set of coordinates.

Hashing produces a (expected) unique value for one object.
But the underlying information that a `Geometry` encodes is not a fixed-set of coordinates, but rather an area (`Polygon`) or a line (`Line String`).

A single area (or line) can be expressed in multiple sets of Coordinates, since the direction or order of the underlying vectors are not considered, but the area which they span in the end.

Think of this polygon `[A, B, C, D, E, F, A]`
![Animation of vectors](imgs/first_anim.gif "[A, B, C, D, E, F, A]")

It spans the same exact area as this Polygon `[D, E, F, A, B, C, D]`
![Animation of vectors](imgs/second_anim.gif "[D, E, F, A, B, C, D]")

In the case of polygons, you can shift your cyclical coordinates however you want.

In `LineStrings` you see similiar behaviour . You can read them  [palindromically](https://en.wikipedia.org/wiki/Palindrome).

`[A, B, C, D, E]`
![Animation of vectors](imgs/third_anim.gif "[A, B, C, D, E]")
`[E, D, C, B, A]`
![Animation of vectors](imgs/fourth_anim.gif "[A, B, C, D, E]")


If your hashing function needs to provide a hash, unique to the shape of your Geometry, not to the particular set of coordinates, you need to be able to consistenly choose a _starting point_.

The actual part that gets hashed should stay the same, whether or not you enter `[A, B, C, D, E, A]` or `[C, D , E, A, B, C]` or any other mutations.

To do this, we have to consistenly choose a starting point. After thinking far too long about how I can sort coordinates reliability, I chose the easy way out:
<script src="https://gist.github.com/AltayAkkus/e1cf62051c2cec3d6110a1a7f5de4f3a.js"></script>

This function returns the same coordinate for all mutations.

Now we can override our `hashCode()` function
<script src="https://gist.github.com/AltayAkkus/59e8787c0dcfe60c9f9dbe796de073c1.js"></script>

_Note: The `equals` function override actually checks if the coordinates are the same, because our hashing can lead to [collisions](https://en.wikipedia.org/wiki/Hash_collision)_



<script src="https://gist.github.com/AltayAkkus/11340f102c1ca14903ead8d699438496.js"></script>

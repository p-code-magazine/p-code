## Language specification

| Symbol | Meaning |
| - | - |
| ~ | Sign Wave  |
| ^ | Trianglar Wave |
| N | Sawtooth Wave |
| [ | Square Wave |
| = | Mute (Rest) |
| \<CODE\> | Iterate `CODE` |
| NUMBER | Set frequency (Hz) |
| +NUMBER | Adding `NUMBER` to set frequency |
| -NUMBER | Substructing `NUMBER` to set frequency |
| *NUMBER | Multiply `NUMBER` to set frequency |
| /NUMBER | Devide `NUMBER` to set frequency |

## Tutorial

### Numbers and Symbols

The number means the frequency. One symbol becomes a unit of time (1/30 sec).

Sine wave at 441Hz.
```
441~
```

11025Hz square wave
```
11025[
```

Decimals can also be used for numbers.

Triangular wave at 123.456Hz.
```
123.456^
```

To keep playing the same sound, make the same symbols in succession.

Sawtooth wave duration of 882Hz (0.5 seconds).
```
882NNNNNNNNNNNNNNNNNNN
```

### Repeat
The same thing can be written over and over again. Repeat the part sandwiched by `< >`.

2^ (number of nests) repeated in the nest of `< >`.
```
882N
882<N>
882<<N>>
882<<<N>>>
882<<<<N>>>>
```

In this way, the length of the sound doubles. Also, if parentheses are missing, they are completed at the end.
```
882<<<<N>
```

All but unreserved characters (symbols) are interpreted as white noise.

Intermittent noise (repetition of noise and mute (rest))
```
<<<<#=>>>>
```

### Arithmetic

The frequency can be used to calculate the addition and division.

1550Hz square wave
```
44100/7/5/2/3*5+1000-500[[[[
```

A number without an operation symbol is considered to be an absolute value.

Intermittent repetition of 441Hz and 882Hz sine waves
```
<<<<441~~==+441~~==>>>
```

The above code can also be written as follows.

```
882<<<-441~~==+441~~==>>>
```
```
<<<<441~~==*2~~==>>>
```

I can use repetition to create different rhythms.

```
<<<<441~~==*2~~==>>>
```

The frequency can also be continuously changed.

Sine wave sweep (linear)
```
100<<<<<<<<<+10~>>>>>>
```

Inverse sweep of sine wave (linear)
```
10000<<<<<<<<<<10~>>>>>>
```

Sweep of sine wave (logarithmic)
```
20<<<<<<<*1.1~~>>>>
```

Inverse sweep of the sine wave (logarithmic)
```
20000<<<<<<</1.1.1~~>>>
```

### Sample Code

Rhythmic patterns with a combination of repetition and mute
```
<200N==<<<=50^==><<=800~>2000[>>=*==>>>
```

I'm going to code what looks like a formula.
```
<<<<100+100=200~>>>
```

No matter what code you write, it's not an error.
```
Hello, world!
```

A code of silence.
```
@<<<<<<<<<<=>>>>>>@
```

I can also shoot a distress signal (SOS).
```
<<[[==[[==[[==[[[[[[==[[[[[[==[[[[[[==[[==[[==[[========>>
```
---

P-Code is not an error, no matter what code you write. Don't be afraid to write the chords (by hand) and let us hear some amazing sounds that are beyond our imagination.
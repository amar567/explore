# NORAD Two-Line Element Set Format as explained on the Celestrack website

```markdown
AAAAAAAAAAAAAAAAAAAAAAAA
1 NNNNNU NNNNNAAA NNNNN.NNNNNNNN +.NNNNNNNN +NNNNN-N +NNNNN-N N NNNNN
2 NNNNN NNN.NNNN NNN.NNNN NNNNNNN NNN.NNNN NNN.NNNN NN.NNNNNNNNNNNNNN
```

Line 0 is a twenty-four character name (to be consistent with the name length in the NORAD SATCAT).

Lines 1 and 2 are the standard Two-Line Orbital Element Set Format identical to that used by NORAD and NASA. The format description is:

| Line 1 |     |
| --- | --- |
| Column | Description |
| 01  | Line Number of Element Data |
| 03-07 | Satellite Number |
| 08  | Classification (U=Unclassified) |
| 10-11 | International Designator (Last two digits of launch year) |
| 12-14 | International Designator (Launch number of the year) |
| 15-17 | International Designator (Piece of the launch) |
| 19-20 | Epoch Year (Last two digits of year) |
| 21-32 | Epoch (Day of the year and fractional portion of the day) |
| 34-43 | First Time Derivative of the Mean Motion |
| 45-52 | Second Time Derivative of Mean Motion (Leading decimal point assumed) |
| 54-61 | BSTAR drag term (Leading decimal point assumed) |
| 63  | Ephemeris type |
| 65-68 | Element number |
| 69  | Checksum (Modulo 10)  <br>(Letters, blanks, periods, plus signs = 0; minus signs = 1) |



| Line 2 |     |
| --- | --- |
| Column | Description |
| 01  | Line Number of Element Data |
| 03-07 | Satellite Number |
| 09-16 | Inclination \[Degrees\] |
| 18-25 | Right Ascension of the Ascending Node \[Degrees\] |
| 27-33 | Eccentricity (Leading decimal point assumed) |
| 35-42 | Argument of Perigee \[Degrees\] |
| 44-51 | Mean Anomaly \[Degrees\] |
| 53-63 | Mean Motion \[Revs per day\] |
| 64-68 | Revolution number at epoch \[Revs\] |
| 69  | Checksum (Modulo 10) |



All other columns are blank or fixed.

Example:

```markdown
NOAA 14                 
1 23455U 94089A   97320.90946019  .00000140  00000-0  10191-3 0  2621
2 23455  99.0090 272.6745 0008546 223.1686 136.8816 14.11711747148495
```

# An excrept from wikipedia 

A two-line element set (TLE, or more rarely 2LE) or three-line element set (3LE) is a data format encoding a list of orbital elements of an Earth-orbiting object for a given point in time, the epoch. Using a suitable prediction formula, the state (position and velocity) at any point in the past or future can be estimated to some accuracy. The TLE data representation is specific to the simplified perturbations models (SGP, SGP4, SDP4, SGP8 and SDP8), so any algorithm using a TLE as a data source must implement one of the SGP models to correctly compute the state at a time of interest. TLEs can describe the trajectories only of Earth-orbiting objects. TLEs are widely used as input for projecting the future orbital tracks of space debris for purposes of characterizing "future debris events to support risk analysis, close approach analysis, collision avoidance maneuvering" and forensic analysis.

The format was originally intended for punched cards, encoding a set of elements on two standard 80-column cards. This format was eventually replaced by text files as punch card systems became obsolete, with each set of elements written to two 69-column ASCII lines preceded by a title line. The United States Space Force tracks all detectable objects in Earth orbit, creating a corresponding TLE for each object, and makes publicly available TLEs for many of the space objects on the websites Space Track and Celestrak, holding back or obfuscating data on many military or classified objects. The TLE format is a de facto standard for distribution of an Earth-orbiting object's orbital elements.

A TLE set may include a title line preceding the element data, so each listing may take up three lines in the file, in which case the TLE is referred to as a three-line element set (3LE), instead of a two-line element set (2LE). The title is not required, as each data line includes a unique object identifier code.

The transmission format is essentially a cut-down version of the G-card
format, removing any data that is not subject to change on a regular
basis, or data that can be calculated using other values. For instance,
the perigee altitude from the G-card is not included as this can be
calculated from the other elements. What remains is the set of data
needed to update the original G-card data as additional measurements are
made. The data is fit into 69 columns and does not include a trailing
character. TLEs are simply the transmission format data rendered as
ASCII text.

An example TLE for the *International Space
Station*

`ISS (ZARYA)`  
`1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927`  
`2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537`

The meaning of this data is as follows:
### Title line (optional)

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Tle_title.jpg" title="TLE title" />
</figure>

| Field | Columns | Content        | Example     |
|-------|---------|----------------|-------------|
| 1     | 01–24   | Satellite name | ISS (ZARYA) |
|       |         |                |             |

If present, the TLE is a three-line element set (*3LE*).

If not, the TLE is a two-line element set (*2LE*).

### Line 1

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Tle_first_row.jpg" title="TLE first row" />
</figure>

| Field | Columns | Content | Example |
|----|----|----|----|
| 1 | 01 | Line number | 1 |
| 2 | 03–07 | Satellite catalog number | 25544 |
| 3 | 08 | Classification (U: unclassified, C: classified, S: secret) | U |
| 4 | 10–11 | International Designator (last two digits of launch year) | 98 |
| 5 | 12–14 | International Designator (launch number of the year) | 067 |
| 6 | 15–17 | International Designator (piece of the launch) | A |
| 7 | 19–20 | Epoch year (last two digits of year) | 08 |
| 8 | 21–32 | Epoch (day of the year and fractional portion of the day) | 264.51782528 |
| 9 | 34–43 | First derivative of mean motion the ballistic coefficient | -.00002182 |
| 10 | 45–52 | Second derivative of mean motion (decimal point assumed) | 00000-0 |
| 11 | 54–61 | *B*\* the drag term, or radiation pressure coefficient (decimal point assumed) | -11606-4 |
| 12 | 63–63 | Ephemeris type (always zero; only used in undistributed TLE data) | 0 |
| 13 | 65–68 | Element set number. Incremented when a new TLE is generated for this object.| 292 |
| 14 | 69 | Checksum (modulo 10) | 7 |
|  |  |  |  |

### Line 2

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/4/43/Tle_second_row.jpg" title="TLE second row" />
</figure>

| Field | Columns | Content | Example |
|----|----|----|----|
| 1 | 01 | Line number | 2 |
| 2 | 03–07 | Satellite Catalog number| 25544 |
| 3 | 09–16 | Inclination (degrees) | 51.6416 |
| 4 | 18–25 | Right ascension of the ascending node (degrees) | 247.4627 |
| 5 | 27–33 | Eccentricity (decimal point assumed) | 0006703 |
| 6 | 35–42 | Argument of perigee (degrees) | 130.5360 |
| 7 | 44–51 | Mean anomaly (degrees) | 325.0288 |
| 8 | 53–63 | Mean motion (revolutions per day) | 15.72125391 |
| 9 | 64–68 | Revolution number at epoch (revolutions) | 56353 |
| 10 | 69 | Checksum (modulo 10) | 7 |

Where decimal points are assumed, they are leading decimal points. The
last two symbols in Fields 10 and 11 of the first line give powers of 10
to apply to the preceding decimal. Thus, for example, Field 11
(-11606-4) translates to −0.11606E−4 (−0.11606×10<sup>−4</sup>).

The checksums for each line are calculated by adding all numerical
digits on that line, including the line number. One is added to the
checksum for each negative sign (-) on that line. All other non-digit
characters are ignored.
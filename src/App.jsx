import { useState, useEffect, useRef, useMemo, Component, Fragment } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── VERSÃO ───────────────────────────────────────────────────────────────────
const SGP_VERSION = "v3.08.0";
if (typeof window !== "undefined") window.SGP_VERSION = SGP_VERSION;
const BRASAO_SGP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAba0lEQVR42u2deZRcVZ3HP+9V9ZZ0N2kSDCKbqHNAFAVFGRdcBkRBEWVAQWVxPW6g6KDiOMcjruioOMooUQFHDKMzoCOIoMZ9EAQRYRRQlC2GGLKn053urvfmj9/vR90UVd21vPtqu/ecOr3U9t693/v97b8bAd8ClgJzQEQYYfgdCTAK3AicWQQOBHYHZgMAw8gJgOPAJoAiMA1sB0oBgLmP1Pk96iMAFoEdBsAIiPWJAMD8R1wFjL08DG+Re/NhtIcJhlX1KfX77gsj3zEHTAC/Bt7jSKK+G8WAhbaAbwlwK3CqeiCKwExgwDDyYr5bgROBB3UNJvVnGgAYhk/w7api9wRgtYrdvwHbgEJgwDB8gm8Z8FPglcBaBVwKbFYQFgMDhpH1SNXCXQZcAZwMrFfwlXT+54C7AwDD8AG+VMXuV4DTVdTGlN0uNv+3dtBapHluhABAP6OkLDcGfBh4B+L3M4e/u9ioXjjVAeuR6nUP5gXCAEA/+t4iBdpbgPN0UaMK8OH8fQvwF2CojWK4pN9fAm7ICxsBgNnrexPA/Yib5TIFX1IFfC7jTAKrHOC2Y9OM63W8V/XRkTyuJQAwm2ELtRT4AfBi4DpdyNICrGbP/SewhXzdMale+1LgDuAFwG7Ac4CteeAjADAb9hjRxyeAk4C/KpDm6gRvrGL4amWiuZyuewDYBVgJHKW63/uBDXlthADA1ljP2ON+4FVqcJQqLN1GxqeAjZ6NgMSxzjcAbwbepOL305RdRMEK7mBdb04V9jHgG8CLgGsd1kiaAEUM3A58VFmwlDEIE/3MMWXrS5X1VurzbwaekbcaEJIRGrcUi2po3Al8BLhcn2uVORL9jAuBx6kFvY5y/lwrOl6EpMHHwC+U6X7sXPd+wFmq9+UaEuwHAKa0nupk2eK7qKj6N11ESyZIMxJbxoTvRfIE34r4B6ccV069oEN1PNMprwdWAN9xwG6uoXN1U20OAMxW5BRUVO7QyU6bBN64ft7Vqqf9JiPWq2URJ8A5wO/056OR0onpBb4vVv1xWH9fC3xfxewqB5ixY4icoirERtoQDuxVAJqusx34PfCYJsRWQRmvpOLqi+piMeAlnpR1Y+wI8SOuAl4NvBR4rG6Gys1kTDYFPKDAXaXXfY/zOnfDlIB9FODbaVM6WLEHWS9Cgv83AV/TxRtAEj6jOnSlIcQhvFUZ76vAD52FjnKwEi0eW0AyZT4NfB6pYHyCAmdCjYltas3ep3rpXfq3y4p2zSXnPgA+hFREbqJN6WDFHmO9EZ3Iz6me9nngEJ3guGJx3UUe0keChMSuBb4J3OwsWOzBMq3nngxAM3o9N9fp3Ygq9MFKFjwFOE5Fb9tyEXsBgDbJZpm+XwF0MXCkWpJu+lNBGXFAf58G7kXin9cgOXubqgCvXYVDSQX7RnUwZzIPMEuqknyAciY2AYDNL05R9aKVwL+oyLoIqbfYhISW7LU7VLTeDfwJ+C1Sof87tQBdlkg96nmtiOVmh4G3CHxc1ZTcrd5eAmAJWKwK9FmqqwG8UBXvD6uVN6mgW6dW4Wr9OVVDbHUS6LIcxn5nIg7oDXRAGUC3AtCKe24HzlDxCRJM/zISFvtpA3rSfGKrF4apIIcBZyvzxZ2yK7pN3ysh8ddr1TVxg07wPoiPbhESZnqOvmdIn7dHJdMl9HYqvCXBLgU+i/gJO6YLRtxl4IuU+S5UllurxkQE/CuwN+Vg/oXAE1XvwzEkeh1wlXqf+fc+ARxAuSyAAMDGwBerzncu8G4kVDWgP89Q8Wvgm9Idf5GCskR/lj1aStgZSCnoxk5Tu7oBgBaVGATepWLW3CmzwKH6f9eii9Xw2E/dMUsdN0ye7BN1APhegLimtnTienc6AFPK/rq3KaMVnOcWIelLwzy8vVxRQXkIEoRflLPuk5JNIkQrRscBiEM+pUO7n3UyABPHcHgbEpkoOi6SBHg78HRqpxEVVewciURHBh128sl8IH625W0AoblbliPloEsRZ3tHrnWnAtAtD3w78F8KpjnHqjsQyZlbSLQUkbSpk1RUp57v28C2XNk5zlEc29yMIe6oA2hDjl+vMOBipHXZNx3wRc51n0M51y2qAxQzwOMdgPseW4BjKdcEF3IC3wjwJeBwVUE62tfbiQBMkPZlH0OiG25xj03y0Yg3v5H08chxyeQ1t5t1oxyj91D0DL5hxP10DG1OMuhWAFpd7VcpF3S7wXjb4Wc1yWJ56mIWZZlT/fPpnkBoczSuRtqx3QK+TgNgCUkAXYWkpNuuTp1rTYFXAE+hAzI56gThjKoTlwBPzRCEkWOU7YUkrx5Nh8R4uw2Axmx3I3UQ0xW6WuQo12/U57ulpa2lfO0KfB14tmNMxS18Jvo5zwa+jcR5N9Bl8f1OAGDqsN2ZSLaKK3pd9nu5GhJTdFcYMUaydpYoCF9Dua64UOe9RM5rrTrvnUga2l6qD3ddckknLGKiovc84Gfs7Otz2W8IyfHr1gN1CmoEFYHzgQsUOCUWzsQxfdJea6z3QX1+ii4NNbZ7x5jedy3isa9WZWY7/kjgSXRYML2JDV9CfHMnq6vkEnU13VvDRWTgGwSeqZvQ2mhsbIBBAwCriN5BxEn8PkcvSqswJIgjuRcaeZtTehMSpfgg8I9qQKxn54o3U02eoqz5WJUEW9W46foEi3buHDu07jzgj1X0Plf3ezzwrC6xfBsRyTPKYqM1yMBUjb2Bg9WY2Uxr3RICAFUMjSNZyxfz8M6hlQtwLOIf7LUTPc2wmFuA2WfViInosbSydgHQDkk8Vye3lu5jXTuPotzdoBdHPaHEnmwk1Y6bsq4FKymn0yfzXNvBwP50cEZHGN0DQMvve0CV6nr6tTwPyeUrheUKAMzC8BhT18O98+h+xpQFNT7Cae4BgJmw3zDSTfSiBdjPrmtfR/wGAAYAtqz7LUJCUWuofmxBpVJ+MBJDDQwYANgy+w0q8P6jATAdQrlNRhgBgC3pfqPAVUgbsfl0P2PLCHFAd2vsN4wOAmABcaReWsdrDWwTSLeDmQDAAMBW2W8x4vO7mYUbPBrYHoXESoP+FwDYsv5XQNKHkjq+08C2pwI3CcvUu6OYA/gGkZODrnEYsZ6xB+UoSZTBdbSjJ4zbibWZ5wMAMxC/i5BO7X+tw/hwx96I39C6W7UySvpZgznObeRcf6nGJrLI0FC/qhl55QP+oEK81guau8imi6clvq7NcW7nkEaZ87VDS3UNNtCnoUafALTdvQ74X+d/9YAF4JNIP7usRHDkGDQ+9Ur77NVIt9aojutK1UtQ7xwFANa56CNq/d7bxMLbCUE+RGMeI0HKB8JoIwCLyLm5ZgmXOgAoeTJM1KHX1RcAtFYYv+4CoNADYO/KEXuc+AHkyIQ/VOhGYYThnQFTdS3c41ieaRObI8sqONNB89wIjVjvwQr2wIC3N6n/0Qaw+Bghi7uNOiAKwGaYKkVSsZ5MNrUg1lnhL5TPD/Gln9n1jyNt0iydrJYfMNZ7vFKt/og+0h2LHhdhBjkOqxm9tAQ8Fzl6IYuGO9b27TLgJ/gtcDcALUPqXkZYOBLyN+Dn+HE79R0ATeROIuG3ZtnmTqRrwtYMGNBOuczTL5cgRefTdQBwU78aab4YsKDMta4JANprVyuLDpBNo+929FApOIZINM9m7cczTB4Sdz4Y0OKbW5t8P0jm9IP07qnuYXgEYKziZ6YJpdpeu55yMD84dAMAG/7cjfOInnpEVwrcpgwYABgA2PDnbm0BgDZuokNP+AmjswGIWsGtiHGQ08wfDCwYANjosNy7VlwYkRoi/4f40tKMriuMPmHAmQyuLQF+RDbF6RHlVnBh9AEAs8hiBvgh4qjNwlc2GZa8fwDY6smUJobvQHIKWy3RtL7MPkSxNZAsVDzCaCMAixVM1ooYvpxs4rfrPYDN7jFBQm6z+nNTgFf9IMl6pMpYrQ5jvKuRxIY9aa5Vh3VjWNsi6GrVFy8BdnMeuyCt5cyJHoyfGipa0ZNIssPzWmVAi5VuRM4MPgcJ7heauNkdSHy5kWHfU6Kc2zeKnMP7ZOCJwGOQIvoJpAZ6wAHrNoL7qNqaPmQQFnVhYg8AXJIBAN0L/hpwii50Ix2zDMSbHQAudE2xAzyQHjXPAY4ADqXcNiTVa5nTxzTl8kqCHjgvIcwYAEsZ71ITdxNIEqh1t09bAHMBSe26FDlJs5EkBUt5WsPC5QEmag14ByMH5LwA6dRlyaM7kGQLe0/k/B5A1yAApxyREWUIwF2RftBZHBJt1/YV4JVIsme9LGj9af7ksH1SQ9yaqH0q8GaksHxMWW0L5USLALTWjd9J+8XH2Wt2EM2yjHRM66r1APCFJlwyMXBLjWtxWW93JAv7u8jxWYky3Yxj+QaDIhuS2mwLsznjSTUGXKy6UlZGjoHwYuBXagyU6gTfNPCbKuI3cj77JUgTpTeoPrfRYcYAuuyNkE22OOvJvkbCxN5+Hi58Gjngb64O5rbruB+JKbsAdO/5Awrs3Sn7CoOI9QvCB20RfHaM2t+DaC8gzY6+qJb23AKsOYykdW1yQGd64CJgBXC26iQ7CBnYeYjfElKIRazskLWz1Pw8+1dYlVm5eGKke9YNqmuWFthtP66wWFMF35fVqFlf4X4Jw68BskP1eWLKxT9ZA3BGXRe7ZagHuiJ0EjmyfgvV0/ZN/K5l51pgMzo+j5zCuS7oebmK3gKSrLzGBeBkxjqPAXA3JGqQNbuYb/BWFZ/DVQwME7HX6T2a+yRRne8EBV8QufmOos77egPFGvxkHZv+9TRPN2L64LeATyGO76RiEyRIc3QzKkrAccAZ6l4Jhka+I1GpdJ+K4dj8gPeRffWZ6YFPd77cxw0VgI8hJzDZsQ52Lt0fgVWUM7T3BD5M2TkexG7+YwBpOoABECTnbiBjkJiy+QTkzI/Ug5Lvdph/J+JAXqrifwS4QvUNY/f3KwjD2cPt1QNvo0Ivu5XsszZMD3wE8PfsHDPNmgUt2+VNSAb17mplXeYw8eHA8Wq0BL2vPcMMEANg4gJwm6eFiYAj8XsehrlmtgKnAb9AcgjvdqzeM/X+QqPM9up/qyk3rUoNcHchjcT3zVg8xUiywzPUIl6Hv/ZjBsItiG9vmLLD+XnKgFuD4dFW0TuMxOQtASaxAPs0co7bsAdDZAewF/B8D+6YWiDcpCLYvu9UwrGvnTAiykd2RLY4ppf9zDP6j/NoDVfTCY39HgE8i/Yc1dWporAd8zCg0umXDiZ2yo37JeIczNofaLlfz0Sc0j6s4WqANyCuQ/x+a5DYcalPgZhSPrV+MGdd2HzCv0dcYw+dGRM7Yuse4Ldkf0KlmyF9oku/OU7695B0q2uQRNkB+qt/szXIXKYG51dz9gRYi+QfUXFialzx82r89GGJlAVfhvjp8m44VFCL+CTgPUiG8xJ6oxF6PeJ2F/37fN2IQ9SfT5ml++V7rvh1gVdyALgOP1GRaSQ/8PicxHAlA9j3/TvSPPy7ugiL9Pmkx4CX6P0tRhJtX4Y44h+BZHtvI98Dy29CcjJ3OrItdhBpqVk/1QvPekEMhKc5nx/lvCi2G28HXgO8VidlQnWUbgZi6ui3i5FalhvUA3AS0mks0t8brSxs9boGkbJaC51CFZeIXcxKT+CIVfQ9QXXBvFnQXSSz/r8DHA28W3XgJUgIL+kiqzl1dLxxBd+vgdepuL2Scj3LuDLhVE5zbwcW3acSh0qxH1dRVH+COAsXe2ADc0y/UfWSdjWfNHAVdFOsQEov/wk5WmxcH1GHsmLqXNegGlaxGlmnKPCuQBIwCs59HAM8jvJ5JHmoPqNIRtJ6qvhi4yrK4gxwiSLXhxieAh6vorgdLFjNOiwgzusVSCnma1VvSih3PMBZ9LRNm8a+f0DZegwJbV2AJNeeBFxVBXgm+l5J7SMjfIwBpLjr4krjgxruEPt7VE3mfcg+c8Q9G+NIncCoA1imsigdVReOUXY8QOdlFonuzDoTGtFcsoV7qPcRSJ2EG6q0HMZjgW843/lXJNH2apVYG+a5B/uMZyJNnmZy3NxLkTS5t1DjuLZilQkxk3kF8GmyP73HwnN7INnMZ9AZqVGuLmX+0dv08RngSUh7DnOoL1PxZx2xZucR17XOCEmpr2ZmVlWDnyCJFtdTDjXiiLakymcZmF+lUm2KfOLh1g7lC7XYr9bE2P8WI6lN+3lSWi04faJObDMHGvoesSPG3LEX0pjoYOBA4NHAcp2zQWeuEmpnAdk8DynzHYbUr1RL1jAVYHuVa5tPJbCNtK+u5UhOInhO2W8F8K751jaaB70lBccKleNZ7xqr2bhdLdFJ/KZstcra0TwLPorkIO6pjz2UISdUTxupMtdT6ovbrBb4l1m4g2uhAtj1sFBJJc0/k08Zgmvc/YNawDVVrKiO3X85ksq02cPF2045HykU6kQWnG9uGgFDFpsgbeL1Y8p++1JuFOWb/ZYp4M9faE0XAmCiYuYqyk7OyMOOGQZO1onqFhDWYshqel5ax3uyvmebxxOACz0RSC23y+/UeNuxkFSLFxCRBSRP8AIVJz6AYRf4SRVdJbqvXsM1ANzHfOxY+R4fbpuCbuw0pzkw0J9DnWcfx3XcRKzWcD1dCJoVZ9tVRHxG3RK+6kf6ZZhVfChSj5NH3Ncynr6ANI+qS5LVQ8lWXHSLGiUFso9gGAgPUgD+mFC/kYW+eLaCcLtnAJaQyNavgLc77E4WADRqXYM4j4/DTyjHwnSH63fdHEDY9DwmwN7Ah5w19CVRLBy4DXi1upLiLAFoN1BEUmoe5ZnW55DIw61I9mwAYeMATIHXAy/GbyFW6rih3oY4yRsyIhsBkBkH70HqR5bQ2nlwtUSHXfwXkbYec4Q63kbmz/IAj8d/AX6CuNHOQ9x1xUZthLgJtE8iBeB/xk9WrXVUGEWSIg4JIGyY/Sx27TPtag7Jwvk68HGadJ/FTSC+gCSunopESEbw48ParrvrUsQXGUBY3/pEObheLIBwLfAO57tT3wA0UVxAgvSn6S4b8gjCZUiS7GEBhHWx31OQRgA+dfQJpL73DSrmm2420OwFuq1yT0eyNYY9gLCoIn8CSUc6ip1z3cJ4+DgZP8nELvh+40jAuJXvasU6Msv4z0g559FIcsFMxjsv1s8cVhfQenXRuLs+GB8yD3sA55LtuS+V4Lu+GXeLDwC6OuGf9cKO0ouc9gBCs7hfrAbKz5Vxg5umHPk4HXipSo04Y/AtRdLmXoM0NC1kMe9Z+IeMCe9FIhiHI77CrL3vtst3AM9FDgu8Hj+pYt3IfiPAR5UA5jJiP4vT74p0on090l4jzmrTxxnukALSeuHlyk7LyD5VybKV1yMp7FciWReWqdOPQDRxewSSJJuV68Wk2y7A59TgmMwSfGS8YO6plN9Wyj5MDRQfseMpnZyXI63fbnRY11cLuE5mwQ8iFW9ZqD/WQyYB3occX4aPec2aMazGYRapKtuo4tJOzfShF84hdRpHITHkO/uIDY39DkJSoGYdoDS7fnbU7j0qcr/t6JiZb2ofi+SexXEjkiFxKFJhN5WxdWZpW5NITcbLgL9TEK7zeI+dBsB3Ii3oWjE+zLW2BElAPh3x9XpNEPa5OMZC9zoi+amUD3nOmg2tMu0QJA66BElm2OLcay+JZov7Lgc+QrmpVDObew5J3Z/VzzqbchKD1+z0vApUJpHOSHcrGy5XXcUHG04h6UHPReppF+v3uuf9xj0APgPcq5C0+2YiH8Z6E0im05uQpIIoa2OjXQCsFMm3IT1CliHxXUs8yDID2iZuu+7qIxSIyykfypNWsGK3gK7g3J+B45M0doC3q+uN6/s+i9Rn30PZv5eLpMhTPzI23KQgvEPdBnsjkY4sa0HcDgEGRDum4SCd9DWUi2ZwFrcTAQc7FziNqiQ5C2nAXq+BZ8X3Qwq+XyBdCy6jfPxtkvdNtkNxNj/TBHJ8wmt1QlwxmTX4rafKYp3sO5EqvO8jsc3pGpszxW+9clQxL9TQux6pOvThavU/RlWNrXWuo0WNxlUv/yzSKTXJm/XaDUB3gW2in6iK74v0720Oi/kAYoREDkaUIe9EEit+jsSZV8+zeaKKz6v2e605rpzv+Rb9kUhO36H6OBApfrdTDaap0m+vyjBGG9d7vRSp111dobK0jebbLWbc3igvVLHyNBWTk56A6IIxRhIdLKVsnaoHv0XqW+9A8h83epqDIcSRvre6kA5Euoc9Wv8/pIw9Tbk5UVzH2hm4x/TnNUh1400OAbS9B2KnKOCxI+YG1Kp7K9KdappyEZQvHS1xjKUBXXQ7O2+bGi73I20m7ke6U61VUG7VjWJ6rHWfsh4xg8q0u+hjmTLZHkjM/FFqIC3R77WjxWb0kdZg34XuZVTfcx0SSrvGAV5KhyRwdJoF6IrlUaSf3euUFaZVhPgEYjWdr6BgHHCMgtQB26wy1A5dVGOpwYr3DjigdD9jjod31mqm3ZsLvCISBLgA8cEm7NzbpqMsrU50N7hiecwB4gG66NurKO7kCEoXJHEFYKIKnTBxGKeaMdNsb0HXuIgUeJEaVF9S4M1SvWdgAGCTQDweKQN4sv5/G+2P+6ZtmGtXfx3T369DOmxdRTkm3PF9drrBCVsJxCGkB/JpyGHYAwrEuQb0pG4dJrYHlfG2I0miFwE/qFAbuqLJejctViUQI8QJeyrSh27MMQZ864l5DwPTMJImtQ5pz3sJ0hHfnZ+uOhOvG9mimk5zEFKM8xJ1Z5jBUq/LolPZLnH0uyJyrO5/I5GLu+aZDwIA87OaXZfC7kiC6gkKykIXiufEcUeNqnV9I1IVeCUSynQNsK6uh+kVfamyl/OgiuWTkKyYCRXP0w5wO5XtFqmoXYsUfq9EIjS1Nh0BgJ11PwV27lmzP/AKJCPmsQrSSXY+MamdbJc4bJcgR4ddro97ulm/60cAVuqJLlMsQUJ9r0BqVRYrEHe0wWgxph5RxtuAnNF3GbDKYeqeELP9CMD5xDNI+4oTkYq6fRSE2yn71nzMi22GooI/QpIgrlDD4k7ntUV6/yjZvgEg84ix3dRyPhFJdTKf4gzZJava9w0p8LYip9NfpjretoqN0nNiNgBwYVaMgGerK+coJGFgO60lQbghsgGkLOC7wDeRdsc9aVQEADbHiq543k/dOCcgdbaWFlZPyM+AVEAc4yUk/Wkl8D9IQX3fsl0A4MKs6Cr84yqeT0ESQiMVn9WSQN0Q2RiS2f1DpHnjKnY+LLtv2S4AsHnxfCRSNvA81eW2Om6cRP83ivjurkBCZLdViNm+Z7swGt+clUz3DAXX35CIxAMqnv+AHDW2TwWQC2Eaw8hiVFbMPQ05hPkWpGn78nleG0YYmYpnl9UmAvBaG/8PqSn74hqrhpwAAAAASUVORK5CYII=";
const FAVICON_SGP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAKDUlEQVR42t2bfYwdVRnGfzNz9+5XP7ZLl6VNrUUbChRBFDVFCJGiRAQ/MBiwiCAo/6hoiJ+IiDEhMRiNWAXRYLR+kmIbLaAWBCvWNNrIR9Eibt2qtBXqtrvbhe69M+Mf85zs4WTmzszuvXs3nGTS9t6Zued9z/O+z/O+59QDdgJdQMzcGRHg6WrFCIEFwO0VYNEcc0Co+URADfBb9BsLge4KUNfVbgd4MngR8FdgA3CjPmuFA+pA5FtQa/dVA/qAfwPrgPuBwHJO0YsSz7QEXtMZNWAxsAu4ENgDjAPPApUS6Ax1f0fRZ/w5kOwiYBC4F7gIGJYR/wUeB7p1T6MRW+FzUA6sFnFCuxwQKwa7gXnALcBlwCHNyUz8+1rNKMMY8x4fWAJsA74MHCs0tA0BUQaFmQkHwAAwBFwCfMmK20iT94WKDcAyfW8Sdqj7OhU6db3j3XrfYiEil0YrLVjZGOhVDHuOQ7r03QFgPXAbMCaHhCnv8oDrgMNKjAsthBwF/glsEVKGgI8Bbwb2CTmFqOfpJumASIb0aVKDwGn6vKpVGgI2Ad8D/qXngoJwfSVwBtAPjAJ/V454Xt+fKuYILefl6YCvNQsBda1sBHxQf/8csFursUvx+YiQYQyPChhvKOsfutxR1fe3KiTGLPpkNkKgrlXfC7wXWAmsBk7RShxx7i9quBtWvsP15rNJ4PPAGuC5sjZVmmB8P/AnxWgVuENG/t4RMxQw3GsQilHK3GvA24CPA/+bjj1+E4x/GLgY2C/jO4AXgLuAc6yYDHPyTNVa1SILVxfSvmHlAWbLAQb224HLlaU/BJytBBUqHm+2VtXLmcMaUViUk8GN8S8Hfqh8MzldW6bzUKQfHQKukMEDwEetBORpkl4OrLEcE2o1zxC0K47TfL27DqwCNkofTJRJejN1QKwfqwFXS64CXAmsEPQ9R9QUHZNCzY+Bt6ZUqCZ/vAv4hRAwPhPjp+MAw583A3/R8wuUANMm45Wcy1GgR8LmW0KWQdE5wM+A7wDzxS4zMr6sA4zxDwJ3KmlFwPnAK5SIvCbMpyZYvx843qLB65RsD+ueGRtf1gGGc2+yJoUquKiJ7Suz4ocUBmaMy3i/ma0yv+Tq/1zQNxzcD7xWK9bswirISIJNHX6J+yYUl7YaWw0cV7TymovDL7j686XsHnNobZUVt2HGVYZh3Gdb3qeslIDjxhSnnSJBFDvvipTN+0rMpUMh1SUnd7agXC/tgFgTOyDJi7OqP1UdMOmEgHHIIWsV8zT+U9ITdcvpQwWEVMsd0A3sUFnrTma7rpk2UZCo+lFGmMbtygFGl++0VuUlNfIQYOTsk85q+fr8QuAsqTLfWdWqKsT1OSto3rUCuEbhZOZ2J8k+QdscYOTpcIYDTgU+pVivpBRMjwHftKrBuEExtAz4tJxp+odbrNbZrDsgtvj/YEbc7lAXZtRBQKTnRkrMpUayETJhsUCt3SFgEHDEMdxk7l2Sp91iB7sLXCmRMzz9VsUqgyuzIa6KCqEwAx37lCCzdm+iDBr05JzACo36XFWCfsZ95rNNpO/f+Spg7G6Q0fO26qvr+fntYoE4hwY7percpqVBxS9J2tVLLEFkhNA+x1nmmUHgjcDrgRP07z6FW0t537XPVHW9VgvLpcBukk3H4Yzu0KiaobdKzHRYIbLbqfNXAh9Wx+c4q3Vmb3nN5pjwLdrJQkAXU3tzXsr3PslOz5/VHQqt3sFOK8NfCzwAfEBwHyFpZY+pmTLbOSAGRnymNhPiBj3AEzMcYJ55AfiEFe8dwH+AR/X9LcBX9a6DTG2QBlaOmc1y2tNC7fdJdnSCBjfWgVc79OeiIJAmuFGx3KXyeQS4nmTT8oBFj+3uHQTSG3t9kvM4WSrN1+qepo5QVusr1EtvJ2ltL9LfTwJukMAJ5kjTxFS4zwHDFcXp0Qyq8/TdMuANwG90X5iBBI9kU/Rp4AmSFndsoaRl2bxEd8sw225gzFeP7xkaHynxgXfm0FNs5YC7SDrFb7I6O3GLDDcdq6L0aRCw3Rg2qvjtyYhxI2jeIq7P87bRAHuA98m5A1Y+iZtoeI+6SFukRYqccwhkz4OummuUMSclVq4g//BBbHH6r4C1JCdBAI6Rc6bT84ssB86T4U+R7B98EVie0plKe0evKPtJwDP081sVNlkoCMTXV2k1i8acob3PkBxduUPFU7/Yomol0XrKZTuoVw7sAP5AchBjLUmr/hrNq1bAiVXgB4biTdVVl3G3MXU2zx11ksNH61W3VwqKF89JnMdq4ueJXZbI8RUHRZ0ku8079I7P6j2bSI7GYMnqh8RS9RxR161QOVfs9qIefyewlaTVnbXRESvO3g78keLne7DEjn1/jzpBK4ClQkVFkx0H7taCeCnVZFUMda1keN7pELOAV5J0uAMg9CyohvLMPerwBA28OKSkOEb5XWDPythlnwucErsial5N490pc5jjfuBSe86BI3mHRCnniR2CDF2wnGR7ejPT2xKzKdO3ymTfueKM/oJxxFrgIzQ+GGV4f4TkMMeojaggJWn9juSQwkmkb3mbAup1gvADMxQ5sYUG92qEhljZf5XiOStkPc3zaom+wH53kKH9t8q7LyN9H9444VzB8CEH2q1u4kQq0G5qoGKNY/tVj9ydlrP8DEn5LPAe4G+inloDivukkpBvFTutruQQnBdkMJGR5YvEWN/NSthejpcHVeuf3aCgCeWkrar6hlOor5nGxzJsm7U4npPwevT715OcNslkqyCnJT4uyhgAztTL3f/GYu47keQExyHtB8RW5m7WMN2mS0lOl486iTwU5PeL7jbnUXVQYF+gBtxHskNzlrw+4SDIV1enV0XTGtX/e6ycEJRsfHgOI9ga4itMnRI3easqZGxRDfJ4EZ0SFMjQZiKPqgG6VAouMGrKgfzzanReItREao5OpFSFfsrlOUnMvparpXaxfsfM7xiF6A1qyowVFWllGhT2Cy9SC+x0GTbhtM/NJsl8PbdX5ec2ld/Dgm+j0SOZfALwGnWQX6VVNkJtodjoJ0rEzzgOpJkOsFnDiIt1kqInCw1HHGRFlq7v0e+Nq3u8X38eZuqoa5eMWqwEPKBMX1GlZ06a9+mZe4Gvy6mUlObTckAaGnpFmVeRbJYaHR9ZkLZlb6BkZrbBfCfDR1Z1WJPhpju9QKt/H/BtlbWkSOSWOyCtyusALlB9fqZWfNwSKn6KSIlT8o3bbO0VgoZVCW6QPnEROSNRQRMdgaT0ZXLIMqY2WOMcJoismn2eELCT5CjOZlV8TTG8mQ5wHWFDcRB4h0LkdEF+jKmTnvZBaZP4ukWhv1Zy2+ZQadwMw1vhgEa1v09y1nedyuh+OcKEh2lqPkFyHvgeXnwwYtox3u6RpgRXAl+QsYfFBhvVZKk6Rvu8hEbgOGMpyf/1ucC5b1Z3jv4P/RIZdLgDoQUAAAAASUVORK5CYII=";


// ─── TOKENS ──────────────────────────────────────────────────────────────────
// ─── WORKER CONFIG ────────────────────────────────────────────────────────────
const WORKER_URL = "https://citerol-sgp.israel-caetano-lima.workers.dev";
const SGP_TOKEN  = "sgp_citerol_2024_xK9mP";

// TEMPO LIMITE: sem isso, uma requisição pendurada deixava a tela "carregando"
// pra sempre — sem erro, sem botão de tentar de novo. Com o limite, a falha
// aparece na tela e o usuário consegue reagir (Atualizar).
const API_TIMEOUT_MS = 45000;
// Envios com anexo (programação, amostras, upload de etapa) precisam de folga:
// o tempo inclui a subida dos bytes pelo navegador, que depende da internet
// da fábrica. 3 min evita o falso "servidor demorou demais" em arquivo grande.
const UPLOAD_TIMEOUT_MS = 180000;
async function apiFetch(path, method = "GET", body = null, opts = null) {
  // Envio com arquivo demora legitimamente mais que uma leitura: o navegador
  // ainda está subindo os bytes quando o timeout padrão (45s) estoura. Quem
  // manda anexo passa { timeoutMs } maior.
  const limiteMs = (opts && opts.timeoutMs) || API_TIMEOUT_MS;
  const doFetch = async () => {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), limiteMs) : null;
    try {
      return await fetch(`${WORKER_URL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-SGP-Token": SGP_TOKEN,
          // Sessão individual — SÓ nas rotas que precisam dela (bordador externo).
          // Enviar em tudo exigia que o worker declarasse o header no CORS; sem
          // isso o navegador barrava TODAS as chamadas no preflight, inclusive o
          // login. Restringir aqui evita que um deploy fora de ordem derrube o
          // sistema inteiro de novo.
          ...(function(){
            if (!String(path||"").startsWith("/bordador/")) return {};
            try { const t = localStorage.getItem("sgp_sessao"); return t ? {"X-Sessao": t} : {}; }
            catch { return {}; }
          })(),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl ? ctrl.signal : undefined,
      });
    } catch (e) {
      if (e && e.name === "AbortError") throw new Error("O servidor demorou demais para responder. Clique em Atualizar para tentar de novo.");
      throw e;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
  // Retry APENAS em GET (idempotente) e só em falhas transitórias (rede, 5xx, 429).
  // POST/PATCH nunca são repetidos para não duplicar ação.
  const maxTentativas = method === "GET" ? 3 : 1;
  let ultimoErro;
  for (let i = 0; i < maxTentativas; i++) {
    try {
      const res = await doFetch();
      if (!res.ok) {
        if (method === "GET" && (res.status >= 500 || res.status === 429) && i < maxTentativas - 1) {
          await new Promise(r => setTimeout(r, 350 * (i + 1)));
          continue;
        }
        // Mostra a MENSAGEM que o worker devolveu, não só o código HTTP. Antes
        // aparecia só "Worker POST /voltar-etapa/... → 400", que não dizia nada
        // ao usuário nem ajudava a diagnosticar.
        let detalhe = "", corpoErro = null;
        try {
          const corpo = await res.clone().json();
          corpoErro = corpo;
          if (corpo && corpo.error) detalhe = String(corpo.error);
        } catch {
          try { const t = await res.text(); if (t && t.length < 300) detalhe = t; } catch {}
        }
        const err = new Error(detalhe || `Worker ${method} ${path} → ${res.status}`);
        // Expõe status + corpo pra quem chama poder tratar casos específicos
        // (ex.: 409 com precisaConfirmar no Gerar Bordado).
        err.status = res.status; err.corpo = corpoErro;
        throw err;
      }
      return res.json();
    } catch (e) {
      ultimoErro = e;
      if (method === "GET" && i < maxTentativas - 1) {
        await new Promise(r => setTimeout(r, 350 * (i + 1)));
        continue;
      }
      throw e;
    }
  }
  throw ultimoErro;
}

// Mescla os resultados das filas de forma estável, evitando que itens "pisquem"
// entre atualizações por causa de falhas pontuais ou da eventual consistency do
// HubSpot (uma busca pode retornar 12 ou 14 conforme o índice).
// Regras:
//  - endpoint falhou (items=null) → mantém os itens anteriores do grupo;
//  - item ausente numa resposta nova → só é removido após sumir em 2 atualizações seguidas;
//  - se o pedido já aparece "fresco" em alguma fila, remove as cópias "presas" das outras.
// ─── Fonte única da verdade dos pedidos em aberto ────────────────────────────
// Cache no Worker (20s) garante que todas as telas vejam exatamente os mesmos
// números. Quando uma ação muda stage, o cache é invalidado automaticamente.
// Estado global e listeners para sincronizar entre telas:
const _snapState = { data: null, loading: false, error: null, lastFetch: 0, listeners: new Set() };
function _emitSnap(){ _snapState.listeners.forEach(fn => { try { fn(); } catch(e){} }); }
async function _fetchSnap(force){
  if (_snapState.loading) return; // dedup
  _snapState.loading = true; _emitSnap();
  try {
    // O quadro tem tempo próprio: quando o cache está vazio, o worker precisa
    // reconstruir tudo do HubSpot e isso passa dos 45s padrão. Com o timeout
    // curto o front abortava e a tela ficava zerada com "não foi possível
    // atualizar" — mesmo com o worker ainda trabalhando e terminando bem.
    const r = await apiFetch("/snapshot-aberto" + (force ? "?force=1" : ""), "GET", null,
      { timeoutMs: 120000 });
    // ESTABILIDADE: se a resposta vier VAZIA (build parcial/timeout no worker)
    // mas já temos um quadro carregado, MANTÉM o que está na tela. Antes, uma
    // resposta ruim zerava tudo e depois voltava — a tela "piscava".
    const temPedidos = !!(r && r.porEtapa && Object.values(r.porEtapa).some(g => g && (g.items||[]).length > 0));
    if (!temPedidos && _snapState.data) {
      _snapState.lastFetch = Date.now() - 25000;   // tenta de novo em ~5s
    } else {
      // Reaplica as remoções recentes: o HubSpot pode ainda não ter indexado a
      // nova etapa e devolver o pedido na fila antiga — sem isso o card sumia e
      // voltava, dando a impressão de que a ação não tinha funcionado.
      _aplicarRemocoes(r);
      _snapState.data = r;
      _snapState.lastFetch = Date.now();
    }
    _snapState.error = null;
  } catch (e) {
    // Guarda a mensagem REAL do worker: "não foi possível atualizar" sozinho
    // não diz se foi timeout, erro do HubSpot ou queda de rede.
    _snapState.error = e.message || "erro ao carregar";
    try { console.error("[SGP snapshot]", e); } catch {}
  } finally {
    _snapState.loading = false; _emitSnap();
  }
}
// Remove um pedido do quadro em memória, na hora, sem esperar a reconstrução.
// Depois de uma AÇÃO o worker leva alguns segundos pra remontar o snapshot —
// nesse intervalo o card continuava na caixa e parecia que a ação não pegou.
// Aqui ele some imediatamente; o refresh que roda logo atrás confirma.
// Se `etapa` for informada, tira só daquela caixa (o pedido pode estar em mais
// de uma); sem etapa, tira de todas.
// Registro das remoções otimistas. O HubSpot leva alguns segundos pra indexar a
// nova etapa, então o snapshot seguinte ainda pode trazer o pedido na fila
// antiga — e o card VOLTAVA depois de já ter sumido. Guardamos o que foi
// removido e reaplicamos em todo snapshot recebido, por até 2 minutos.
const _snapRemovidos = new Map();   // vendasId -> { etapa, ts }
const REMOCAO_TTL_MS = 120000;
function _aplicarRemocoes(data){
  if (!data || !data.porEtapa) return;
  const agora = Date.now();
  for (const [vid, info] of _snapRemovidos) {
    if (agora - info.ts > REMOCAO_TTL_MS) { _snapRemovidos.delete(vid); continue; }
    for (const nome of Object.keys(data.porEtapa)) {
      if (info.etapa && nome !== info.etapa) continue;
      const g = data.porEtapa[nome];
      if (!g || !Array.isArray(g.items)) continue;
      g.items = g.items.filter(it => String(it.vendasId || "") !== vid);
    }
  }
}
function snapRemoverPedido(vendasId, etapa){
  if (!vendasId) return;
  const alvo = String(vendasId);
  _snapRemovidos.set(alvo, { etapa: etapa || null, ts: Date.now() });
  _aplicarRemocoes(_snapState.data);
  // Força o próximo useSnapshotAberto a rebuscar (não espera os 30s).
  _snapState.lastFetch = 0;
  _emitSnap();
}
function useSnapshotAberto(){
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(n => n + 1);
    _snapState.listeners.add(fn);
    // Se nunca carregou ou está velho demais (>30s), busca
    if (!_snapState.data || (Date.now() - _snapState.lastFetch) > 30000) _fetchSnap(false);
    return () => _snapState.listeners.delete(fn);
  }, []);
  return {
    data: _snapState.data,
    loading: _snapState.loading,
    error: _snapState.error,
    lastFetch: _snapState.lastFetch,
    refresh: () => _fetchSnap(true),
  };
}
// Helper: extrai todos os pedidos de um snapshot (achata porEtapa)
function snapTodosPedidos(snap){
  if (!snap || !snap.porEtapa) return [];
  // O snapshot pode conter o MESMO card em várias etapas (via etapasAtivas do Worker).
  // Aqui deduplicamos por vendasId pra contagem/lista sem repetição. Usamos a etapa
  // do card (a "principal") como sua etapa canônica na lista.
  const vistos = new Set();
  const out = [];
  for (const nome of Object.keys(snap.porEtapa)) {
    const g = snap.porEtapa[nome];
    if (!g || !g.items) continue;
    for (const it of g.items) {
      const key = it.vendasId || it.id;
      if (vistos.has(key)) continue;
      vistos.add(key);
      out.push({ ...it, _grupo: nome });
    }
  }
  return out;
}
// "atualizado há X" formatado
function _ageStr(ts){
  if (!ts) return "—";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "agora";
  if (s < 60) return `há ${s}s`;
  const m = Math.floor(s/60);
  if (m < 60) return `há ${m} min`;
  return `há ${Math.floor(m/60)}h`;
}
// Componente de status: "atualizado há Xs" + botão Atualizar agora + erro/parcial
function SnapStatus({snap}){
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n => n+1), 5000); return () => clearInterval(t); }, []);
  if (!snap.data && !snap.error) return null;
  const parcial = snap.data && snap.data.parcial;
  const cor = snap.error ? C.red : parcial ? C.amber : C.gray500;
  const txt = snap.error
    ? "Não foi possível atualizar — " + String(snap.error).slice(0,90)
      + (snap.lastFetch ? " · última carga " + _ageStr(snap.lastFetch) : " · nunca carregou")
    : parcial
      ? `Atualizado ${_ageStr(snap.lastFetch)} · algumas etapas falharam (${(snap.data.etapasComErro||[]).join(", ")})`
      : `Atualizado ${_ageStr(snap.lastFetch)}`;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11.5,color:cor,fontWeight:600,...F.body}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:snap.loading?C.amber:(snap.error?C.red:C.green),display:"inline-block"}}/>
      <span>{snap.loading ? "Atualizando..." : txt}</span>
      <button onClick={snap.refresh} disabled={snap.loading} style={{...F.body,fontSize:11.5,fontWeight:600,background:"transparent",border:"none",color:C.red,cursor:snap.loading?"default":"pointer",padding:0,textDecoration:"underline",opacity:snap.loading?0.5:1}}>Atualizar agora</button>
    </div>
  );
}

function mesclarEmAberto(prev, resultados) {
  const prevArr = prev || [];
  const MAX_MISSES = 2;
  const out = [];
  for (const res of resultados) {
    const prevGrupo = prevArr.filter(o => o._grupo === res.nome);
    if (res.items === null) { out.push(...prevGrupo); continue; }
    const novosIds = new Set(res.items.map(o => o.id));
    out.push(...res.items.map(o => ({ ...o, _misses: 0 })));
    for (const p of prevGrupo) {
      if (!novosIds.has(p.id)) {
        const m = (p._misses || 0) + 1;
        if (m < MAX_MISSES) out.push({ ...p, _misses: m });
      }
    }
  }
  const idsFrescos = new Set(out.filter(o => (o._misses || 0) === 0).map(o => o.id));
  return out.filter(o => (o._misses || 0) === 0 || !idsFrescos.has(o.id));
}


const C = {
  red:"#9E0B0F", redHover:"#7a0809", green:"#4B5528",
  black:"#111", gray800:"#2d2d2d", gray700:"#444",
  gray600:"#666", gray500:"#888", gray400:"#aaa",
  gray300:"#ccc", gray200:"#e2e2e2", gray100:"#f2f2f2",
  gray50:"#fafafa", white:"#fff",
  amber:"#b45309", blue:"#1e40af", teal:"#0f766e", purple:"#6d28d9",
};
const STAGE_COLOR = {
  "Programação":C.amber,"Amostra Digital":C.purple,"Amostra Física":"#be185d",
  "Em Separação":C.blue,"Conferência Separação":"#0369a1",
  "Conferência e Direcionamento":"#059669",
  "Bordado Interno":C.green,"Bordado Externo":C.purple,
  "Expedição":C.teal,"Análise de Frete":"#0891b2",
  "Pendente Pagamento":"#be123c",
};

// ─── ÍCONES SVG ───────────────────────────────────────────────────────────────
// Cada ícone é um path SVG 24x24, traçado monocromático
const ICONS = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  pin:       "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  // Faltavam no mapa: o menu e a caixa de arquivos já pediam esses dois nomes.
  search:    "M21 21l-4.35-4.35 M11 19a8 8 0 100-16 8 8 0 000 16z",
  chevDown:  "M6 9l6 6 6-6",
  grid:      "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  funnel:    "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z",
  chart:     "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  history:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  trophy:    "M8 21h8m-4-4v4M5 3h14M6 3v8a6 6 0 0012 0V3",
  list:      "M4 6h16M4 10h16M4 14h16M4 18h16",
  needle:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  monitor:   "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  scissors:  "M6 9a3 3 0 100-6 3 3 0 000 6zm12 6a3 3 0 100-6 3 3 0 000 6zM6 9l12-6M6 15l12 6",
  arrow:     "M13 7l5 5m0 0l-5 5m5-5H6",
  box:       "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  dollar:    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  users:     "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  gear:      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  bell:      "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  check:     "M5 13l4 4L19 7",
  warn:      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  clock:     "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  chevR:     "M9 5l7 7-7 7",
  chevL:     "M15 19l-7-7 7-7",
  send:      "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  phone:     "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  image:     "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  download:  "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  refresh:   "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  close:     "M6 18L18 6M6 6l12 12",
  up:        "M5 15l7-7 7 7",
  inbox:     "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  eye:       "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  eyeOff:    "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M14.12 14.12a3 3 0 11-4.24-4.24 M1 1l22 22",
  barcode:   "M3 5v14M6 5v14M8 5v14M11 5v14M13 5v10M16 5v14M18 5v10M21 5v14",
  print:     "M6 9V3h12v6 M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2 M6 14h12v7H6z",
  lock:      "M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z M8 11V7a4 4 0 118 0v4 M12 15v2",
  chat:      "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z",
  radar:     "M12 2v4 M12 18v4 M2 12h4 M18 12h4 M12 21a9 9 0 100-18 9 9 0 000 18z M12 16a4 4 0 100-8 4 4 0 000 8z",
};

function Ic({ n, s = 16, c = "currentColor", style = {} }) {
  const paths = (ICONS[n] || ICONS.check).split("M").filter(Boolean);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: "block", ...style }}>
      {paths.map((p, i) => <path key={i} d={"M" + p} />)}
    </svg>
  );
}

// ─── SLA ─────────────────────────────────────────────────────────────────────
const SLA_DEF = {
  "Programação":8,"Amostra Digital":16,"Amostra Física":24,
  "Em Separação":24,"Conferência Separação":24,
  "Conferência e Direcionamento":8,
  "Bordado Interno":72,"Bordado Externo":120,
  "Expedição":8,"Análise de Frete":8,
  // Retido esperando o cliente pagar — o relógio continua correndo.
  "Pendente Pagamento":24,
};

// ─── MÓDULOS DO SISTEMA ───────────────────────────────────────────────────────
// Cada módulo é uma permissão individual atribuível a um usuário.
const NAV_ITEMS = [
  // Principal
  {id:"raiox",       label:"Raio-X",             icon:"radar",   grupo:"Principal"},
  {id:"chat",        label:"Chat",               icon:"chat",    grupo:"Principal"},
  {id:"demandas",    label:"Minhas Demandas",    icon:"pin",     grupo:"Principal"},
  {id:"dashboard",   label:"Dashboard",          icon:"grid",    grupo:"Principal"},
  {id:"funil",       label:"Funil em Tempo Real",icon:"funnel",  grupo:"Principal"},
  {id:"posvenda",    label:"Painel Pós-Venda",   icon:"phone",   grupo:"Principal"},
  // Análise
  {id:"painel_fluxo",    label:"Painel de Fluxo",          icon:"activity",grupo:"Indicadores"},
  {id:"gestao_vista",    label:"Gestão à Vista",           icon:"monitor", grupo:"Indicadores"},
  {id:"pedidos_risco",   label:"Pedidos em Risco",         icon:"warn",    grupo:"Indicadores"},
  {id:"alteracoes_form", label:"Alterações de Formulário", icon:"warn", grupo:"Indicadores"},
  {id:"rel_pendencias",  label:"Relatório de Pendências",  icon:"clock",   grupo:"Indicadores"},
  // ── Separação ─────────────────────────────────────────────────────────────
  {id:"em_separacao",            label:"Em Separação",             icon:"inbox",   grupo:"Separação"},
  {id:"conferencia_separacao",   label:"Conferência Separação",    icon:"check",   grupo:"Separação"},
  {id:"bonificacoes",            label:"Bonificações",             icon:"box",     grupo:"Separação"},
  // ── PCP (pedidos separados parciais) ──────────────────────────────────────
  {id:"op_sob_medida",           label:"Criação de OP Sob Medida", icon:"needle",  grupo:"PCP"},
  {id:"aguardando_producao_sm",  label:"Aguardando Produção SM",   icon:"clock",   grupo:"PCP"},
  {id:"analise_pcp",             label:"Análise PCP",              icon:"activity",grupo:"PCP"},
  {id:"buscar_loja",             label:"Buscar Produto em Loja",   icon:"inbox",   grupo:"PCP"},
  {id:"analise_producao",        label:"Análise da Produção",      icon:"box",     grupo:"PCP"},
  // ── Ocorrência (devolução / reclamação) ───────────────────────────────────
  {id:"ocorrencias",             label:"Painel de Ocorrências",    icon:"warn",    grupo:"Ocorrência"},
  {id:"ocor_entrada_devolucao",  label:"Entrada da Devolução",     icon:"inbox",   grupo:"Ocorrência"},
  {id:"ocor_ajuste_pedido",      label:"Ajuste do Pedido",         icon:"refresh", grupo:"Ocorrência"},
  {id:"ocor_registro_reclamacao",label:"Registro de Reclamação",   icon:"list",    grupo:"Ocorrência"},
  {id:"ocor_improcedencia",      label:"Tratativa de Improcedência",icon:"warn",   grupo:"Ocorrência"},
  // ── Amostra ───────────────────────────────────────────────────────────────
  {id:"programacao",             label:"Programação",              icon:"needle",  grupo:"Amostra"},
  {id:"amostra_digital",         label:"Amostra Digital",          icon:"monitor", grupo:"Amostra"},
  {id:"alteracao_amostra_digital",label:"Alteração de Amostra Digital",icon:"refresh",grupo:"Amostra"},
  {id:"aprovacao_amostra_digital",label:"Aprovação Amostra Digital",icon:"check", grupo:"Amostra"},
  {id:"amostra_fisica",          label:"Amostra Física",           icon:"scissors",grupo:"Amostra"},
  {id:"alteracao_amostra_fisica",label:"Alteração de Amostra Física",icon:"refresh",grupo:"Amostra"},
  {id:"aprovacao_amostra_fisica",label:"Aprovação Amostra Física", icon:"check",   grupo:"Amostra"},
  // ── Operação ──────────────────────────────────────────────────────────────
  {id:"conferencia_direcionamento",label:"Conferência e Direcionamento",icon:"arrow",grupo:"Operação"},
  {id:"bordado_interno",         label:"Bordado Interno",          icon:"needle",  grupo:"Operação"},
  {id:"bordado_externo",         label:"Bordado Externo",          icon:"box",     grupo:"Operação"},
  {id:"silk_dtf",                label:"Silk / DTF",               icon:"image",   grupo:"Operação"},
  {id:"expedicao",               label:"Expedição",                icon:"box",     grupo:"Operação"},
  // ── Outros (fora de grupo, colapsável) ────────────────────────────────────
  // Acesso externo: aparece só para quem está vinculado a um bordador.
  {id:"bordador_demandas",       label:"Minhas Demandas",          icon:"needle",  grupo:"Bordador"},
  {id:"pendente_pagamento",      label:"Pendente Pagamento",       icon:"clock",   grupo:"Faturamento"},
  {id:"analise_frete",           label:"Análise de Frete",         icon:"send",    grupo:"Faturamento"},
  {id:"finalizados",             label:"Finalizados",              icon:"check",   grupo:"Faturamento"},
  // Pausados: pedidos parados esperando algo de fora da produção.
  {id:"pendencia_comercial",     label:"Pendência Comercial",      icon:"clock",   grupo:"Pausados"},
  {id:"aguardando_pedido",       label:"Aguardando Outro Pedido",  icon:"clock",   grupo:"Pausados"},
  // Ferramentas: telas de apoio, não são filas de trabalho.
  {id:"pedidos",                 label:"Pedidos em Aberto",        icon:"list",    grupo:"Ferramentas"},
  {id:"impressao_pedido",        label:"Impressão de Pedido",      icon:"print",   grupo:"Ferramentas"},
  {id:"banco_imagens",           label:"Banco de Imagens",         icon:"image",   grupo:"Ferramentas"},
  // Cadastros
  {id:"codigos_barra", label:"Códigos de Barra",   icon:"barcode", grupo:"Ferramentas"},
  // Sistema
  {id:"sla",         label:"Configurações",     icon:"gear",    grupo:"Sistema"},
  {id:"usuarios",    label:"Usuários",           icon:"users",   grupo:"Sistema"},
];

// Ordem dos grupos no menu e nas telas de permissão. Centralizada de propósito:
// ao criar um grupo novo em NAV_ITEMS, basta incluir aqui e ele aparece em todos
// os lugares (sidebar, menu mobile, cadastro de usuário e acesso em lote).
// Ordem dos grupos no menu. "Outros" era um depósito com 8 itens sem relação
// entre si — virou Faturamento / Pausados / Ferramentas. "Análise" virou
// "Indicadores", que descreve o que realmente tem lá dentro.
const GRUPOS_MENU = ["Bordador","Principal","Indicadores","Separação","PCP","Ocorrência","Amostra","Operação","Faturamento","Pausados","Ferramentas","Sistema"];

// Mapeia módulo de operação -> etapa do funil (para "Minhas Demandas")
const MODULO_ETAPA = {
  em_separacao:               "Em Separação",
  conferencia_separacao:      "Conferência Separação",
  bonificacoes:               "Bonificações",
  op_sob_medida:              "Criação de OP Sob Medida",
  aguardando_producao_sm:     "Aguardando Produção Sob Medida",
  analise_pcp:                "Análise PCP",
  buscar_loja:                "Buscar em Loja",
  analise_producao:           "Análise Produção",
  conferencia_direcionamento: "Conferência e Direcionamento",
  programacao:                "Programação",
  amostra_digital:            "Amostra Digital",
  alteracao_amostra_digital:  "Amostra Digital",   // mesma etapa, só reprogramações
  aprovacao_amostra_digital:  "Aprovação de Amostra Digital",
  amostra_fisica:             "Amostra Física",
  alteracao_amostra_fisica:   "Amostra Física",    // mesma etapa, só reprogramações
  aprovacao_amostra_fisica:   "Aprovação de Amostra Física",
  bordado_interno:            "Bordado Interno",
  bordado_externo:            "Bordado Externo",
  silk_dtf:                   "Silk/DTF",
  expedicao:                  "Expedição",
  analise_frete:              "Análise de Frete",
  pendente_pagamento:         "Pendente Pagamento",
  pendencia_comercial:        "Pendência Comercial",
  aguardando_pedido:          "Aguardando Outro Pedido",
  ocor_entrada_devolucao:     "Entrada da Devolução",
  ocor_ajuste_pedido:         "Ajuste do Pedido",
  ocor_registro_reclamacao:   "Registro de Reclamação",
  ocor_improcedencia:         "Tratativa de Improcedência",
};
// Mapa módulo -> endpoint do Worker (para carregar demandas ao vivo)
const MODULO_ENDPOINT = {
  em_separacao:               "/em-separacao",
  conferencia_separacao:      "/conferencia-separacao",
  bonificacoes:               "/bonificacoes",
  op_sob_medida:              "/op-sob-medida",
  aguardando_producao_sm:     "/aguardando-producao-sm",
  analise_pcp:                "/analise-pcp",
  buscar_loja:                "/buscar-loja",
  analise_producao:           "/analise-producao",
  conferencia_direcionamento: "/conferencia-direcionamento",
  programacao:                "/programacao",
  amostra_digital:            "/amostra-digital",
  alteracao_amostra_digital:  "/amostra-digital",
  aprovacao_amostra_digital:  "/aprovacao-amostra-digital",
  amostra_fisica:             "/amostra-fisica",
  alteracao_amostra_fisica:   "/amostra-fisica",
  aprovacao_amostra_fisica:   "/aprovacao-amostra-fisica",
  bordado_interno:            "/bordado-interno",
  bordado_externo:            "/bordado-externo",
  silk_dtf:                   "/silk-dtf",
  expedicao:                  "/expedicao",
  analise_frete:              "/analise-frete",
  pendente_pagamento:         "/pendente-pagamento",
  pendencia_comercial:        "/pendencia-comercial",
  aguardando_pedido:          "/aguardando-pedido",
  ocor_entrada_devolucao:     "/ocor-entrada-devolucao",
  ocor_ajuste_pedido:         "/ocor-ajuste-pedido",
  ocor_registro_reclamacao:   "/ocor-registro-reclamacao",
  ocor_improcedencia:         "/ocor-improcedencia",
  ocorrencias:                "/ocorrencias",
};

// Mapa de etapa -> propriedade de arquivo no HubSpot
const ETAPA_PROPRIEDADE = {
  "Programação":     "programacao_de_bordado",
  "Amostra Digital": "amostra_digital",
  "Amostra Física":  "amostra_fisica",
};

// Propriedade do motivo de rejeição por etapa que volta
const ETAPA_PROP_MOTIVO = {
  "Amostra Digital": "motivo_da_rejeicao_da_amostra_digital",
  "Amostra Física":  "motivo_da_rejeicao_do_bordado",
};

// Mapa nome da etapa -> ID da etapa no HubSpot (funil Bordado)
const ETAPA_STAGE_ID = {
  "Programação":                "1377887836",
  "Amostra Digital":            "1377887837",
  "Aprovação de Amostra Digital":"1377887838",
  "Amostra Física":             "1377887839",
  "Aprovação de Amostra Física":"1377887840",
  "Liberado para bordar":       "1377887841",
  "Bordado Externo":            "1377887842",
  "Bordado Interno":            "1377706615",
  "Bordado Interno e Externo":  "1383604282",
  "Bordado Finalizado":         "1377706616",
};

// Helper: usuário tem acesso a um módulo?
function temAcesso(user, moduloId) {
  if (!user) return false;
  // BORDADOR EXTERNO é terceiro: só existe a tela dele. Nem chat, nem nada.
  // A trava real está no worker (as rotas /bordador/* resolvem o bordador pelo
  // cadastro, não pelo que o front manda) — isto aqui é só a interface.
  if (user.bordadorExterno) return moduloId === "bordador_demandas";
  if (moduloId === "bordador_demandas") return false;
  if (moduloId === "chat") return true; // chat é de todos
  if (user.admin) return true; // admin vê tudo (inclui Raio-X)
  return (user.modulos || []).includes(moduloId);
}

// Ordem lógica do funil — usada pelo "Voltar Etapa" pra oferecer só as etapas
// ANTERIORES à atual do pedido. Igual à do worker (VOLTAR_ETAPA_MAP).
const FUNIL_ORDEM = [
  "Em Separação", "Conferência Separação",
  // Caixas apartadas: precisam estar aqui para o "Alterar Etapa" conseguir
  // devolver um pedido que caiu nelas por engano. Sem isso a etapa atual não é
  // encontrada na ordem e a tela não oferece nenhum destino.
  "Bonificações", "Criação de OP Sob Medida", "Aguardando Produção Sob Medida",
  "Análise PCP", "Buscar em Loja",
  "Análise Produção", "Programação", "Amostra Digital", "Aprovação de Amostra Digital",
  "Amostra Física", "Aprovação de Amostra Física",
  // "Liberado para Bordar" não é caixa do SGP (o card fica em "Conferência e
  // Direcionamento") — entra aqui só pra o Alterar Etapa poder mover SOMENTE o
  // deal de Bordado. Não vira coluna: as colunas vêm de etapasDoSnapshot().
  "Liberado para Bordar", "Conferência e Direcionamento",
  "Bordado Interno", "Bordado Externo", "Bordado Interno e Externo", "Silk/DTF", "Expedição",
  "Pendente Pagamento", "Análise de Frete",
];
// Índice da etapa no funil (aceita nomes equivalentes de "Conferência e Direcionamento").
function idxFunil(etapa){
  if(!etapa) return -1;
  const e = etapa==="Separação"?"Em Separação":etapa;
  return FUNIL_ORDEM.indexOf(e);
}
// Permissões que NÃO são menus (ações especiais atribuíveis por usuário).
// Vazio: hoje "Alterar Etapa" e "Gerar Bordado" são exclusivas de Administrador.
const PERMISSOES_ESPECIAIS = [];

// Lista de usuários para menções no chat — populada via Worker em runtime.
// Mantida vazia por padrão para não quebrar referências; o chat resolve nomes
// pelos dados do pedido quando disponível.
let USERS = [];


// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const NOW = Date.now();
const h = n => n*3600000, d = n => n*86400000;
function mkTL(stages){
  return stages.map(s=>({
    stage:s.stage,user:s.user,
    enteredAt:new Date(NOW-s.ago).toISOString(),
    exitedAt:s.ex!=null?new Date(NOW-s.ex).toISOString():null,
    dH:s.ex!=null?(s.ago-s.ex)/3600000:null,
  }));
}
const ORDERS_INIT = [];

const HIST = [];

const GER_DATA = {
  etapas:[],
  tempo:[],
  semanal:[],
  dist:[{n:"Bordado Interno",v:0},{n:"Bordado Externo",v:0},{n:"DTF",v:0}],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useIsMobile(){
  const[m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  useEffect(()=>{const f=()=>setM(window.innerWidth<768);window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);
  return m;
}
const fmtD=(iso)=>!iso?"—":new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"});
const fmtDS=(iso)=>!iso?"—":new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
const fmtR=(v)=>"R$ "+Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2});
// Formata horas como "6d 23h" quando >24h, "23h" quando ≥1h, "45min" quando <1h.
// Aceita valor absoluto. Sufixo "atraso" / "restantes" é do chamador.
const fmtHoras=(horas)=>{
  if(horas==null)return "—";
  const abs=Math.abs(horas);
  if(abs<1)return `${Math.round(abs*60)}min`;
  const d=Math.floor(abs/24), h=Math.round(abs%24);
  if(d>0){
    if(h===0)return `${d}d`;
    return `${d}d ${h}h`;
  }
  return `${Math.round(abs)}h`;
};
// Formata duração em minutos -> "2h 15min" / "45min" / "3d 4h"
const fmtDur=(min)=>{
  if(min==null)return null;
  if(min<1)return "menos de 1min";
  const d=Math.floor(min/1440),h=Math.floor((min%1440)/60),m=min%60;
  const p=[];if(d)p.push(d+"d");if(h)p.push(h+"h");if(m&&!d)p.push(m+"min");
  return p.join(" ")||"0min";
};

// ─── PRIORIDADE: ordena pela DATA DE VENCIMENTO do pedido ─────────────────────
// Quanto mais próxima a data de vencimento, maior a prioridade (vem primeiro).
// Por enquanto usamos prazoFinal como vencimento; quando a regra definitiva da
// data de vencimento for criada, basta trocar dataVencimento() abaixo.
// Data limite (vencimento) do pedido — vem calculada do Worker.
// COM bordado sem amostra aprovada => null (ainda não há prazo).
// NÃO faz fallback para closedate (prazoFinal), que não reflete a regra.
// A DATA ESPECIAL é um prazo combinado caso a caso entre expedição e comercial.
// Quando existe, ela MANDA sobre o vencimento calculado pelo SGP. Vazia, nada
// muda: o pedido segue a regra normal de sempre.
const dataVencimento=(o)=>o?.dataEspecial||o?.dataVencimento||null;
const temDataEspecial=(o)=>!!(o&&o.dataEspecial);
// Dourado — a cor que a expedição usa pra achar esses pedidos no meio da fila.
const COR_ESPECIAL="#b8860b";
const BG_ESPECIAL="#fdf6e3";

// ── PRAZO É DIA, NÃO INSTANTE ────────────────────────────────────────────────
// data_vencimento é propriedade `date` do HubSpot: chega como meia-noite UTC
// ("2026-08-18" → 2026-08-18T00:00:00Z). No Brasil isso já é passado desde as
// 21h do dia ANTERIOR — então todo pedido que vence hoje era exibido como
// vencido, e as datas apareciam um dia antes na tela e no Excel.
// A regra é: o pedido tem o DIA INTEIRO do vencimento.
const TZ_BR_MS=3*60*60*1000;
function fimDoDiaVenc(iso){
  if(!iso)return null;
  const txt=String(iso);
  const d=new Date(txt);
  if(isNaN(d.getTime()))return null;
  // "2026-08-18" / "...T00:00:00Z" = propriedade date do HubSpot: o dia é o que
  // está escrito (UTC). Com hora real, o dia é o de Brasília.
  const soData=/^\d{4}-\d{2}-\d{2}$/.test(txt)||/T00:00:00(\.000)?Z?$/.test(txt);
  const ref=soData?d:new Date(d.getTime()-TZ_BR_MS);
  return Date.UTC(ref.getUTCFullYear(),ref.getUTCMonth(),ref.getUTCDate(),23,59,59,999)+TZ_BR_MS;
}
// Vencido? (só depois do fim do dia do vencimento)
function venceuAntes(iso,refMs){
  const f=fimDoDiaVenc(iso);
  return f!=null&&f<(refMs||Date.now());
}
// Formata a data de vencimento sem escorregar um dia por causa do fuso.
function fmtVenc(iso,curto){
  const f=fimDoDiaVenc(iso);
  if(f==null)return "—";
  const d=new Date(f-TZ_BR_MS);
  const dia=String(d.getUTCDate()).padStart(2,"0"), mes=String(d.getUTCMonth()+1).padStart(2,"0");
  return curto?`${dia}/${mes}`:`${dia}/${mes}/${String(d.getUTCFullYear()).slice(2)}`;
}

// ── PRAZO DOS PEDIDOS SOB MEDIDA ─────────────────────────────────────────────
// Sob medida não segue o SLA de bordado/sem bordado: a peça é fabricada do zero
// e o prazo combinado com o cliente é de 60 dias corridos contados do
// FECHAMENTO do pedido (closedate do negócio de Vendas, exposto como
// dataFechamento). Também não faz sentido cobrar separação nessas etapas — não
// há estoque a separar, a peça ainda vai ser produzida.
const PRAZO_SOB_MEDIDA_DIAS=60;
const ETAPAS_SOB_MEDIDA=["Criação de OP Sob Medida","Aguardando Produção Sob Medida"];
const ehEtapaSobMedida=(etapa)=>ETAPAS_SOB_MEDIDA.includes(etapa);
function prazoSobMedida(o){
  const base=o?.dataFechamento||o?.entradaAt||null;
  if(!base)return null;
  const venc=new Date(base);
  if(isNaN(venc.getTime()))return null;
  venc.setDate(venc.getDate()+PRAZO_SOB_MEDIDA_DIAS);
  const hoje=new Date();hoje.setHours(0,0,0,0);
  const alvo=new Date(venc);alvo.setHours(0,0,0,0);
  const dias=Math.round((alvo-hoje)/86400000);
  return {data:venc,dias,atrasado:dias<0,venceHoje:dias===0};
}
// Etiqueta do prazo sob medida — verde folgado, âmbar perto, vermelho atrasado.
function PrazoSobMedida({o,inline}){
  const p=prazoSobMedida(o);
  if(!p)return(
    <span style={{...F.body,fontSize:11,color:C.gray400}}>Prazo: emissão não informada</span>
  );
  const cor=p.atrasado?C.red:p.dias<=10?C.amber:C.green;
  const txt=p.atrasado
    ?`atrasado ${Math.abs(p.dias)} dia${Math.abs(p.dias)>1?"s":""}`
    :p.venceHoje?"vence hoje":`faltam ${p.dias} dia${p.dias>1?"s":""}`;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:cor+"14",color:cor,
      border:`1px solid ${cor}55`,borderRadius:6,padding:inline?"2px 9px":"3px 10px",
      ...F.body,fontSize:inline?10:11,fontWeight:700,whiteSpace:"nowrap"}}>
      PRAZO {fmtDS(p.data.toISOString())} · {txt}
    </span>
  );
}
const ordenarPorPrioridade=(arr)=>[...arr].sort((a,b)=>{
  const da=dataVencimento(a), db=dataVencimento(b);
  if(!da&&!db)return 0;
  if(!da)return 1;          // sem data vai para o fim
  if(!db)return -1;
  return new Date(da)-new Date(db); // mais cedo primeiro
});

// Normaliza um card cru do Worker para o formato que o modal/cards esperam
// Helper de formatação do número do pedido — mostra "PED - <linx> | <vendasId>"
// quando o pedido tem código no Linx; senão, "PED-<vendasId>" como antes.
function idPedido(o){
  if (!o) return "";
  if (o.pedidoLinx) return "PED - " + o.pedidoLinx + " | " + (o.vendasId || (o.id||"").replace(/^PED-/, ""));
  return o.id || ("PED-" + (o.vendasId || ""));
}
// Quantidade de peças do pedido: usa items quando enriched, senão cai pro qtdTotal
// do snapshot. Personalizações (bordado, silk, DTF) não contam porque não são
// peças físicas.
function pecasDoCard(o){
  if (!o) return 0;
  const somaItems = (o.items||[]).filter(i => !i.naoSeparavel).reduce((s,i)=>s+Number(i.qty||0),0);
  if (somaItems > 0) return somaItems;
  return Number(o.qtdTotal||0);
}
// Recalcula statusSeparacao a partir dos items enriched (fonte mais confiável que snapshot).
// Retorna: "completa" | "parcial" | "pendente" | "sem_pedidos" | "carregando"
function statusSepDoOrder(o){
  if (!o) return "carregando";
  // Filtra personalizações (SKUs sem produto físico — bordado/arte).
  // Esses items nunca são separados pelo WMS, então ignoramos na avaliação.
  const its = (o.items || []).filter(i => !i.naoSeparavel);
  if (its.length === 0) {
    const snap = o.statusSeparacao || "pendente";
    if (snap === "sem_pedidos") return "carregando";
    return snap;
  }
  const total = its.length;
  const sep = its.filter(i => i.status === "separado").length;
  if (sep === 0) return "pendente";
  if (sep < total) return "parcial";
  return "completa";
}
// Cores e labels do status de separação
const SEPARACAO_INFO = {
  completa:     {label:"PEDIDO COMPLETO",      cor:"#15803d", bg:"#dcfce7", borda:"#86efac"},
  parcial:      {label:"SEPARADO PARCIAL",     cor:"#c2410c", bg:"#ffedd5", borda:"#fdba74"},
  pendente:     {label:"SEPARAÇÃO PENDENTE",   cor:"#991b1b", bg:"#fee2e2", borda:"#fca5a5"},
  sem_pedidos:  {label:"SEM PEDIDOS APROVADOS",cor:"#525252", bg:"#f5f5f5", borda:"#d4d4d4"},
  carregando:   {label:"VERIFICANDO SEPARAÇÃO...", cor:"#525252", bg:"#f5f5f5", borda:"#d4d4d4"},
  indisponivel: {label:"STATUS INDISPONÍVEL",  cor:"#525252", bg:"#f5f5f5", borda:"#d4d4d4"},
};
function BadgeSeparacao({status, qtdSep, qtdTot, qtdItensSep, totalItens, size="md"}){
  // Status desconhecido/indisponível: não mostra badge (evita o "STATUS
  // INDISPONÍVEL" cinza, que parece erro — ex.: em Conferência e Direcionamento,
  // onde a separação já acabou e essa info nem é relevante).
  if(!status || status==="indisponivel" || !SEPARACAO_INFO[status]) return null;
  const info = SEPARACAO_INFO[status];
  const fontSize = size==="lg" ? 13 : size==="sm" ? 9.5 : 11;
  const padding = size==="lg" ? "6px 12px" : size==="sm" ? "2px 6px" : "4px 9px";
  const detalhe = (status==="parcial" && totalItens>0)
    ? ` (${qtdItensSep||0}/${totalItens})`
    : "";
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",gap:5,
      padding,borderRadius:6,background:info.bg,color:info.cor,
      border:`1px solid ${info.borda}`,
      ...F.title,fontSize,fontWeight:700,letterSpacing:"0.04em",
      whiteSpace:"nowrap",
    }}>
      {info.label}{detalhe}
    </span>
  );
}
// ─── RESPONSÁVEL PÓS-VENDA (quem atende quem) — cruza pelo nome do vendedor ───
// Mapa carregado do worker (KV), editável na aba Configurações.
const normNomePessoa=(s)=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim().replace(/\s+/g," ");
let _respPVMap={};      // { "Responsável CS": ["vendedor1", ...] }
let _respPVIndex={};    // nomeVendedorNormalizado → "Responsável CS"
const _respPVListeners=new Set();
function _rebuildRespPVIndex(){
  _respPVIndex={};
  for(const resp of Object.keys(_respPVMap||{})){
    for(const nome of (_respPVMap[resp]||[])){
      const n=normNomePessoa(nome);
      if(n) _respPVIndex[n]=resp;
    }
  }
}
function responsavelPosVendaDe(vendedor){
  const v=normNomePessoa(vendedor); if(!v) return "";
  if(_respPVIndex[v]) return _respPVIndex[v];
  // match por prefixo (mapeado = 1º nome e vendedor = nome completo, ou vice-versa)
  for(const n of Object.keys(_respPVIndex)){
    if(v.startsWith(n+" ")||n.startsWith(v+" ")) return _respPVIndex[n];
  }
  return "";
}
async function carregarRespPV(){
  try{
    const r=await apiFetch("/config-responsavel-posvenda");
    if(r&&r.success){ _respPVMap=r.mapa||{}; _rebuildRespPVIndex(); _respPVListeners.forEach(fn=>{try{fn();}catch(e){}}); }
  }catch(e){}
}
function useRespPV(){
  const [,tick]=useState(0);
  useEffect(()=>{ const fn=()=>tick(n=>n+1); _respPVListeners.add(fn); if(!Object.keys(_respPVMap).length) carregarRespPV(); return ()=>_respPVListeners.delete(fn); },[]);
  return { mapa:_respPVMap, responsaveis:Object.keys(_respPVMap), de:responsavelPosVendaDe };
}
const normalizarCard=(o,etapa)=>({
  id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
  pedidoLinx:o.pedidoLinx||"",
  client:o.client||"",vendedor:o.vendedor,valor:o.valor||0,
  cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",tel:o.telefone||"",email:o.email||"",
  obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
  condicaoPagamento:o.condicaoPagamento||"",arquivoDtfsilk:o.arquivoDtfsilk||[],
  transportadora:o.transportadora||"",valorFrete:o.valorFrete||0,pagadorFrete:o.pagadorFrete||"",
  tipo:o.tipo||"",numeroOP:o.numeroOP||"",tipoPedido:o.tipoPedido||"",
  // Sob medida: formulário com as medidas, anexado pela vendedora
  formularioSobMedida:Array.isArray(o.formularioSobMedida)?o.formularioSobMedida:[],
  // Ocorrência (devolução/reclamação) — definido pelo funil de origem
  ehOcorrencia:o.ehOcorrencia===true,ocorrenciaId:o.ocorrenciaId||"",
  ocorrenciaTipo:o.ocorrenciaTipo||"",ocorrenciaParecer:o.ocorrenciaParecer||"",
  ocorrenciaMotivo:o.ocorrenciaMotivo||"",ocorrenciaRelato:o.ocorrenciaRelato||"",
  improcPosvendaOk:o.improcPosvendaOk===true,improcSeparacaoOk:o.improcSeparacaoOk===true,
  pagamentoLiberado:o.pagamentoLiberado===true,
  pagamentos:o.pagamentos||[],totalRecebido:o.totalRecebido||0,
  infoImportante:o.infoImportante||"",dadosAdicionais:o.dadosAdicionais||"",
  obsProdutos:o.obsProdutos||"",
  arqProgramacao:o.arqProgramacao||"",arqAmostraDigital:o.arqAmostraDigital||"",arqAmostraFisica:o.arqAmostraFisica||"",
  motivoRejAmDigital:o.motivoRejAmDigital||"",motivoRejAmFisica:o.motivoRejAmFisica||"",
  reprogramacao:o.reprogramacao||false,
  historico:o.historico||[],
  houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
  temBordado:o.temBordado!==false,temSilkDtf:o.temSilkDtf===true,
  dataVencimento:o.dataVencimento||null,
  prazoFinal:o.prazoFinal||null,
  dataFechamento:o.dataFechamento||o.prazoFinal||null,
  dataEspecial:o.dataEspecial||null,
  // Histórico: quando o pedido entrou na etapa final e o nº da NF, quando houver.
  finalizadoEm:o.finalizadoEm||null,notaFiscal:o.notaFiscal||"",
  qtdTotal:Number(o.qtdTotal||0),qtdSeparada:Number(o.qtdSeparada||0),
  totalItensSeparacao:Number(o.totalItensSeparacao||0),qtdItensSeparados:Number(o.qtdItensSeparados||0),
  statusSeparacao:o.statusSeparacao||"pendente",
  bordadoresExternos: Array.isArray(o.bordadoresExternos)?o.bordadoresExternos:[],
  colocadoParaBordar: o.colocadoParaBordar===true,
  colocadoBordarPor: o.colocadoBordarPor||"", colocadoBordarEm: o.colocadoBordarEm||"",
  aguardadoPor: Array.isArray(o.aguardadoPor)?o.aguardadoPor:[],
  subEtapa: o.subEtapa || "",
  stageIdAtual: o.stageIdAtual || o.stageId || null,
  stageIdPV: o.stageIdPV || null,
  stageIdBordado: o.stageIdBordado || null,
  etapasAtivas: Array.isArray(o.etapasAtivas) ? o.etapasAtivas : [(o.etapa || etapa)],
  etapa:o.etapa||etapa,amOk:o.amostrasAprovada||false,sepOk:o.separacaoCompleta||false,
  statusFaturamento: o.statusFaturamento || "",
  entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
  // SLA da Conferência e Direcionamento contado a partir da aprovação da amostra
  // (pedido separado antes do bordado ficar pronto — ver worker).
  slaDesdeAprovacaoAmostra:o.slaDesdeAprovacaoAmostra===true,
  alertas:o.alertas||[],concluido:false,
  bordado:{pts:0,cores:[],arq:"",arqOk:false,amDig:[],amDigObs:"",amFis:[],amFisObs:""},
  items:(o.items||[]).map(it=>({
    id:it.id,bordado:it.bordado===true,sku:it.sku||it.nome,desc:it.nome,cor:it.tamanho,
    qty:it.quantidade,
    qtdSeparada: Number(it.qtdSeparada||0),
    saldoSeparacao: Number(it.saldoSeparacao != null ? it.saldoSeparacao : Math.max(0,(Number(it.quantidade)||0)-(Number(it.qtdSeparada)||0))),
    statusSeparacao: it.statusSeparacao || (Number(it.qtdSeparada||0) === 0 ? "pendente" : (Number(it.qtdSeparada||0) < Number(it.quantidade||0) ? "parcial" : "completa")),
    dest:it.direcionamento?it.direcionamento.toLowerCase():null,
    // Status legado (usado em outras partes do portal): mapeia do statusSeparacao
    status: it.naoSeparavel ? "personalizacao" : ((it.statusSeparacao === "completa" || it.separado === true) ? "separado" : "pendente"),
    descricao: it.descricao || "",
    naoSeparavel: it.naoSeparavel === true,
  })),
  timeline:o.timeline||[{stage:o.etapa||etapa,user:"Sistema",enteredAt:o.etapaAt||o.dataEntrada,exitedAt:null,dH:null}],
  chat:[],bordadosJson:o.bordadosJson||[],arquivoBordado:o.arquivoBordado||[],
  // Preserva campos de tracking de programação (assumidos + executados)
  // usados pra multi-programador na Programação.
  programacaoExecutados: o.programacaoExecutados || [],
  programacaoAssumidos: o.programacaoAssumidos || [],
});

// Filtra os arquivos de bordado por etapa, usando o termo no nome (~PROG / ~AMOSTRA).
// Retrocompatibilidade: se não houver dados estruturados ou nenhum termo, mostra todos.
function arquivosBordadoPorEtapa(order, etapa){
  const json = order.bordadosJson || [];
  const todos = order.arquivoBordado || [];
  if(!json.length) return todos;
  const temTermo = json.some(b => /~(prog|amostra)/i.test(b.fileName||""));
  if(!temTermo) return todos;
  const idsDe = (pred) => json.filter(b=>pred(b.fileName||"")).map(b=>String(b.fileId)).filter(Boolean);
  const ETAPAS_AMOSTRA=["Amostra Digital","Amostra Física","Aprovação de Amostra Digital","Aprovação de Amostra Física"];
  if(etapa==="Programação") return idsDe(n=>/~prog/i.test(n));
  if(ETAPAS_AMOSTRA.includes(etapa)) return idsDe(n=>/~(prog|amostra)/i.test(n));
  return todos; // execução de bordado e demais etapas → todos os arquivos
}


function baixarExcelFinalizados(lista,de,ate){
  const esc=(v)=>String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const cols=["Pedido","Cliente","CNPJ","Centro de Custo","Bordado","Valor (R$)","Data de Vencimento","Data de Finalização","Vendedor"];
  const linhas=lista.map(o=>{
    const venc=dataVencimento(o)?fmtVenc(dataVencimento(o)):"";
    const fin=o.dataFinalizacao?new Date(o.dataFinalizacao).toLocaleDateString("pt-BR"):"";
    const valor=Number(o.valor||0).toLocaleString("pt-BR",{minimumFractionDigits:2});
    return [o.id,o.client,o.cnpj||"",o.centroCusto||"",o.temBordado===false?"Sem bordado":"Com bordado",valor,venc,fin,o.vendedor||""];
  });
  const thead="<tr>"+cols.map(c=>`<th style="background:#9E0B0F;color:#fff;font-weight:bold;padding:6px;border:1px solid #ccc">${esc(c)}</th>`).join("")+"</tr>";
  const tbody=linhas.map(r=>"<tr>"+r.map(c=>`<td style="padding:5px;border:1px solid #ccc">${esc(c)}</td>`).join("")+"</tr>").join("");
  const periodo=`Pedidos Finalizados — ${de||"início"} a ${ate||"hoje"} (${lista.length} pedidos)`;
  const html=`<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>`+
    `<h3>${esc(periodo)}</h3><table border="1" cellspacing="0">${thead}${tbody}</table></body></html>`;
  const blob=new Blob(["\ufeff",html],{type:"application/vnd.ms-excel;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`pedidos-finalizados-${de||""}_${ate||""}.xls`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
// Configuração de horário útil (Brasil, seg-sex 07:00-17:48 BRT)
// 17:48 = 17h48min = 17.8 em decimal. Total do dia = 17.8 - 7 = 10.8h úteis.
const SLA_INICIO_H = 7;
const SLA_INICIO_M = 0;
const SLA_FIM_H = 17;
const SLA_FIM_M = 48;
const SLA_MINUTOS_POR_DIA = (SLA_FIM_H * 60 + SLA_FIM_M) - (SLA_INICIO_H * 60 + SLA_INICIO_M); // 648 min = 10.8h
// Ajusta uma Date pro fuso America/Sao_Paulo. Retorna hora/min locais BRT
// (assumindo que os timestamps do backend estão em UTC).
function _dateBRT(d) {
  // getUTCHours retorna hora UTC. BRT = UTC-3.
  const t = new Date(d);
  return {
    dow: t.getUTCDay(),   // 0=domingo, 1=seg, ..., 6=sáb (em UTC — igual em BRT pra maioria dos casos)
    h: (t.getUTCHours() - 3 + 24) % 24,
    m: t.getUTCMinutes(),
    date: t,
  };
}
// É dia útil? seg=1, sex=5
function _ehDiaUtil(d) {
  const brt = _dateBRT(d);
  // Reajusta dow considerando o offset BRT (se hora UTC < 3, dia anterior)
  let dow = brt.date.getUTCDay();
  if (brt.date.getUTCHours() < 3) dow = (dow + 6) % 7;
  return dow >= 1 && dow <= 5;
}
// Retorna Date no início do dia útil (07:00 BRT)
function _inicioExpediente(d) {
  const t = new Date(d);
  // Cria em BRT: seta hora UTC 10:00 = 07:00 BRT
  t.setUTCHours(10, 0, 0, 0);
  return t;
}
// Retorna Date no fim do expediente (17:48 BRT)
function _fimExpediente(d) {
  const t = new Date(d);
  t.setUTCHours(20, 48, 0, 0); // 20:48 UTC = 17:48 BRT
  return t;
}
// Avança até o próximo dia útil às 07:00 BRT
function _proximoDiaUtil(d) {
  let t = new Date(d);
  do {
    t.setUTCDate(t.getUTCDate() + 1);
  } while (!_ehDiaUtil(t));
  return _inicioExpediente(t);
}
// Calcula MINUTOS ÚTEIS entre dois timestamps (fim - início).
// Só conta o tempo dentro do expediente (seg-sex, 07:00-17:48 BRT).
function minutosUteis(de, ate) {
  const inicio = new Date(de);
  const fim = new Date(ate);
  if (fim <= inicio) return 0;
  let cursor = new Date(inicio);
  let acumulado = 0;
  const limite = 400; // Segurança: no máximo ~400 dias
  for (let i = 0; i < limite && cursor < fim; i++) {
    if (_ehDiaUtil(cursor)) {
      const iniExp = _inicioExpediente(cursor);
      const fimExp = _fimExpediente(cursor);
      const iniDoDia = cursor > iniExp ? cursor : iniExp;
      const fimDoDia = fim < fimExp ? fim : fimExp;
      if (fimDoDia > iniDoDia) {
        acumulado += (fimDoDia.getTime() - iniDoDia.getTime()) / 60000;
      }
    }
    // Vai pro início do próximo dia útil
    cursor = _proximoDiaUtil(cursor);
  }
  return Math.max(0, acumulado);
}
// Adiciona N horas úteis a uma data inicial. Retorna Date do prazo.
function addHorasUteis(dataInicio, horas) {
  const minRestantes = Math.round(horas * 60);
  let cursor = new Date(dataInicio);
  let restante = minRestantes;
  // Se o início cai fora do expediente, pula pro próximo início
  if (!_ehDiaUtil(cursor) || cursor < _inicioExpediente(cursor)) {
    cursor = _ehDiaUtil(cursor) && cursor < _inicioExpediente(cursor)
      ? _inicioExpediente(cursor)
      : _proximoDiaUtil(cursor);
  } else if (cursor >= _fimExpediente(cursor)) {
    cursor = _proximoDiaUtil(cursor);
  }
  const limite = 400;
  for (let i = 0; i < limite && restante > 0; i++) {
    const fimExp = _fimExpediente(cursor);
    const minDisponivelHoje = Math.max(0, (fimExp.getTime() - cursor.getTime()) / 60000);
    if (restante <= minDisponivelHoje) {
      return new Date(cursor.getTime() + restante * 60000);
    }
    restante -= minDisponivelHoje;
    cursor = _proximoDiaUtil(cursor);
  }
  return cursor;
}
// hrsIn: horas ÚTEIS decorridas desde a data (usado pra medir SLA consumido)
const hrsIn = (at) => at ? minutosUteis(at, new Date()) / 60 : 0;
// Dias ÚTEIS decorridos desde uma data (1 dia = 10,8h de expediente). Fim de
// semana não conta — um pedido que entrou na sexta mostra "1d parado" na
// segunda, não "3d". Usado no Painel Pós-Venda e no Raio-X.
const diasUteisDesde = (at) => {
  if (!at) return null;
  return Math.floor((minutosUteis(at, new Date()) / SLA_MINUTOS_POR_DIA));
};
function baixarExcelProgramacao(lista,de,ate){
  const esc=(v)=>String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const cols=["Arquivo","Programador","Dificuldade","Data da execução"];
  const linhas=lista.map(r=>{
    const d=r.data_execucao?new Date(r.data_execucao).toLocaleString("pt-BR"):"";
    return [r.nome_arquivo||"",r.programador||"",r.dificuldade||"",d];
  });
  const thead="<tr>"+cols.map(c=>`<th style="background:#9E0B0F;color:#fff;font-weight:bold;padding:6px;border:1px solid #ccc">${esc(c)}</th>`).join("")+"</tr>";
  const tbody=linhas.map(r=>"<tr>"+r.map(c=>`<td style="padding:5px;border:1px solid #ccc">${esc(c)}</td>`).join("")+"</tr>").join("");
  const periodo=`Relatório de Programação — ${de||"início"} a ${ate||"hoje"} (${lista.length} bordados)`;
  const html=`<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>`+
    `<h3>${esc(periodo)}</h3><table border="1" cellspacing="0">${thead}${tbody}</table></body></html>`;
  const blob=new Blob(["\ufeff",html],{type:"application/vnd.ms-excel;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`relatorio-programacao-${de||""}_${ate||""}.xls`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
// Helper — abre a Impressão de Pedido pré-carregada com o vendasId indicado.
// Usa sessionStorage pra evitar precisar refatorar o hash routing.
const imprimirPedido = (vendasId) => {
  if (!vendasId) return;
  try { sessionStorage.setItem("sgp_imprimir_pedido", String(vendasId)); } catch(e){}
  window.location.hash = "impressao_pedido";
};

function getSLA(o,cfg,etapaOverride){
  // Se a etapa vista NÃO é a etapa real do card (ex.: card aparece na Fila
  // "Separação" mas seu order.etapa é "Aprovação de Amostra Física" por causa
  // do bordado), o SLA da tela deve refletir a etapa vista pela fila. Assim
  // o SLA da Separação é o de Separação, não o do bordado.
  const etapa = etapaOverride || o.etapa;
  const sla=cfg[etapa]||0;
  const hrs=hrsIn(o.etapaAt);
  const pct=sla?hrs/sla:0;
  // Data de vencimento útil: se não tem dataVencimento do backend, calcula
  // baseado em etapaAt + sla em horas úteis.
  let venc=dataVencimento(o);
  if (!venc && o.etapaAt && sla) {
    venc = addHorasUteis(new Date(o.etapaAt), sla).toISOString();
  }
  // htd = horas úteis restantes até o vencimento (não tempo corrido)
  const agora = new Date();
  let htd = null;
  if (venc) {
    const dvenc = new Date(venc);
    if (dvenc <= agora) {
      // Vencido — mede quantas horas úteis DEPOIS do vencimento
      htd = -minutosUteis(dvenc, agora) / 60;
    } else {
      htd = minutosUteis(agora, dvenc) / 60;
    }
  }
  return{sla,hrs,pct,htd,venc,st:pct>=1?"late":pct>=0.8?"risk":"ok",ft:htd==null?"none":htd<0?"late":htd<24?"risk":"ok"};
}

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
const F = {
  title: { fontFamily:"'Oswald',sans-serif", textTransform:"uppercase", letterSpacing:"0.04em" },
  body:  { fontFamily:"'Montserrat',sans-serif" },
};

// ─── PRÉ-VISUALIZAÇÃO DE ARQUIVOS (lightbox reutilizável) ─────────────────────
function tipoPreviewArquivo(nome){
  const ext=String(nome||"").split(".").pop().toLowerCase();
  if(["png","jpg","jpeg","gif","webp","bmp","svg","avif"].includes(ext))return "img";
  if(ext==="pdf")return "pdf";
  return "outro";
}
function FileLightbox({file,onClose}){
  if(!file)return null;
  const url=file.url||file.fileUrl||"";
  const nome=file.nome||file.fileName||"arquivo";
  const t=tipoPreviewArquivo(nome);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.82)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,overflow:"hidden",maxWidth:"92vw",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 12px 48px rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:`1px solid ${C.gray200}`}}>
          <div style={{flex:1,minWidth:0,...F.body,fontSize:13,fontWeight:700,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nome}</div>
          {url&&<a href={url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><span style={{display:"inline-flex",alignItems:"center",gap:5,background:C.red,color:C.white,borderRadius:6,padding:"6px 12px",...F.body,fontSize:12,fontWeight:700}}><Ic n="download" s={13} c={C.white}/> Baixar</span></a>}
          <button onClick={onClose} style={{background:C.gray100,border:"none",borderRadius:6,width:32,height:32,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><Ic n="close" s={16} c={C.gray600}/></button>
        </div>
        <div style={{background:C.gray50,display:"flex",alignItems:"center",justifyContent:"center",overflow:"auto"}}>
          {t==="img"?<img src={url} alt={nome} style={{maxWidth:"90vw",maxHeight:"78vh",display:"block",objectFit:"contain"}}/>
            :t==="pdf"?<iframe src={url} title={nome} style={{width:"90vw",height:"78vh",border:"none"}}/>
            :<div style={{padding:48,...F.body,fontSize:13,color:C.gray500,textAlign:"center"}}>Não é possível pré-visualizar este tipo de arquivo. Use o botão Baixar.</div>}
        </div>
      </div>
      <div style={{...F.body,fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:12}}>Clique fora para fechar</div>
    </div>
  );
}

// ─── EXIBIÇÃO DE ARQUIVOS (resolve fileIds do HubSpot) ────────────────────────
function ArquivosBox({fileIds,titulo,emptyText}){
  const [arquivos,setArquivos]=useState(null);
  const [loading,setLoading]=useState(false);
  const [preview,setPreview]=useState(null); // arquivo em pré-visualização (lightbox)
  // Tipo de pré-visualização pela extensão do nome
  const tipoPreview=(nome)=>{
    const ext=String(nome||"").split(".").pop().toLowerCase();
    if(["png","jpg","jpeg","gif","webp","bmp","svg","avif"].includes(ext))return "img";
    if(ext==="pdf")return "pdf";
    return "outro";
  };

  useEffect(()=>{
    if(!fileIds||!fileIds.length){setArquivos([]);return;}
    setLoading(true);
    apiFetch(`/arquivos?ids=${fileIds.join(";")}`)
      .then(r=>{if(r.success)setArquivos(r.arquivos);else setArquivos([]);})
      .catch(()=>setArquivos([]))
      .finally(()=>setLoading(false));
  },[JSON.stringify(fileIds)]);

  if(loading)return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {[0,1].map(i=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:C.gray50,borderRadius:7,padding:"10px 14px",border:`1px solid ${C.gray200}`}}>
          <div style={{width:32,height:32,borderRadius:6,background:`linear-gradient(90deg,${C.gray200} 25%,${C.gray100} 50%,${C.gray200} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite",flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{width:"70%",height:12,borderRadius:3,background:`linear-gradient(90deg,${C.gray200} 25%,${C.gray100} 50%,${C.gray200} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite"}}/>
            <div style={{width:"30%",height:9,marginTop:4,borderRadius:3,background:`linear-gradient(90deg,${C.gray200} 25%,${C.gray100} 50%,${C.gray200} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite"}}/>
          </div>
          <div style={{...F.body,fontSize:11,color:C.gray400,display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"inline-block",width:12,height:12,border:`2px solid ${C.gray300}`,borderTopColor:C.red,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            carregando
          </div>
        </div>
      ))}
    </div>
  );
  if(!arquivos||arquivos.length===0)return <div style={{...F.body,fontSize:13,color:C.gray400}}>{emptyText||"Nenhum arquivo anexado."}</div>;

  return(
    <>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {arquivos.map((a,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:C.gray50,borderRadius:7,padding:"10px 14px",border:`1px solid ${C.gray200}`}}>
          <div style={{width:32,height:32,borderRadius:6,background:C.red+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic n="download" s={16} c={C.red}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{...F.body,fontSize:13,fontWeight:600,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nome}</div>
            {a.tamanho>0&&<div style={{...F.body,fontSize:11,color:C.gray400,marginTop:1}}>{(a.tamanho/1024).toFixed(0)} KB</div>}
          </div>
          {a.url
            ?<div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              {tipoPreview(a.nome)!=="outro"&&<button onClick={()=>setPreview(a)}
                style={{display:"inline-flex",alignItems:"center",gap:5,background:C.white,color:C.red,border:`1.5px solid ${C.red}`,borderRadius:6,padding:"6px 12px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                <Ic n="search" s={13} c={C.red}/> Ver
              </button>}
              <a href={a.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:5,background:C.red,color:C.white,borderRadius:6,padding:"7px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  <Ic n="download" s={13} c={C.white}/> Baixar
                </span>
              </a>
            </div>
            :<span style={{...F.body,fontSize:11,color:C.gray400}}>indisponível</span>
          }
        </div>
      ))}
    </div>
    {/* Lightbox de pré-visualização */}
    {preview&&<div onClick={()=>setPreview(null)}
      style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.82)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,overflow:"hidden",maxWidth:"92vw",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 12px 48px rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:`1px solid ${C.gray200}`}}>
          <div style={{flex:1,minWidth:0,...F.body,fontSize:13,fontWeight:700,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{preview.nome}</div>
          <a href={preview.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:5,background:C.red,color:C.white,borderRadius:6,padding:"6px 12px",...F.body,fontSize:12,fontWeight:700}}><Ic n="download" s={13} c={C.white}/> Baixar</span>
          </a>
          <button onClick={()=>setPreview(null)} style={{background:C.gray100,border:"none",borderRadius:6,width:32,height:32,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><Ic n="close" s={16} c={C.gray600}/></button>
        </div>
        <div style={{background:C.gray50,display:"flex",alignItems:"center",justifyContent:"center",overflow:"auto"}}>
          {tipoPreview(preview.nome)==="img"
            ?<img src={preview.url} alt={preview.nome} style={{maxWidth:"90vw",maxHeight:"78vh",display:"block",objectFit:"contain"}}/>
            :tipoPreview(preview.nome)==="pdf"
              ?<iframe src={preview.url} title={preview.nome} style={{width:"90vw",height:"78vh",border:"none"}}/>
              :<div style={{padding:48,...F.body,fontSize:13,color:C.gray500,textAlign:"center"}}>Não é possível pré-visualizar este tipo de arquivo. Use o botão Baixar.</div>}
        </div>
      </div>
      <div style={{...F.body,fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:12}}>Clique fora para fechar</div>
    </div>}
    </>
  );
}

function Av({ini,size=32,bg=C.red}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,...F.title,flexShrink:0}}>{ini}</div>;
}

function Tag({label,color=C.gray600}){
  return <span style={{background:color+"18",color,border:`1px solid ${color}30`,borderRadius:3,padding:"2px 8px",fontSize:11,fontWeight:600,...F.body,display:"inline-block"}}>{label}</span>;
}

function Card({children,style={},onClick,especial}){
  // especial = pedido com DATA ESPECIAL combinada. Fundo dourado pra a
  // expedição achar de longe no meio da fila.
  const base = especial
    ? {background:BG_ESPECIAL,border:`1.5px solid ${COR_ESPECIAL}`}
    : {background:C.white,border:`1px solid ${C.gray200}`};
  return <div onClick={onClick} style={{...base,borderRadius:8,padding:18,cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}

// Selo do prazo combinado. Aparece junto do número do pedido em qualquer fila.
function TagDataEspecial({o,size}){
  if(!temDataEspecial(o))return null;
  return <span title={"Prazo combinado entre expedição e comercial: "+fmtVenc(o.dataEspecial)}
    style={{display:"inline-flex",alignItems:"center",gap:5,background:COR_ESPECIAL,color:"#fff",
      borderRadius:6,padding:size==="sm"?"2px 8px":"3px 10px",...F.body,
      fontSize:size==="sm"?10:11,fontWeight:800,letterSpacing:"0.04em",whiteSpace:"nowrap"}}>
    DATA ESPECIAL {fmtVenc(o.dataEspecial,true)}
  </span>;
}

function SecH({children,style={}}){
  return <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:12,...style}}>{children}</div>;
}

function PageH({title,sub,bc,onRefresh,refreshing}){
  return (
    <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
      <div>
        {bc&&<div style={{...F.body,fontSize:12,color:C.gray400,marginBottom:4,display:"flex",gap:6,alignItems:"center"}}>
          SGP <Ic n="chevR" s={11} c={C.gray400}/> <span style={{color:C.gray600}}>{bc}</span>
        </div>}
        <h1 style={{...F.title,fontSize:24,fontWeight:700,color:C.black,lineHeight:1.1}}>{title}</h1>
        {sub&&<p style={{...F.body,fontSize:13,color:C.gray500,marginTop:4}}>{sub}</p>}
      </div>
      {onRefresh&&<button onClick={onRefresh} disabled={refreshing}
        style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:8,border:`1.5px solid ${C.gray200}`,background:C.white,cursor:refreshing?"wait":"pointer",...F.body,fontSize:13,fontWeight:600,color:refreshing?C.gray400:C.gray700,whiteSpace:"nowrap",flexShrink:0}}
        onMouseEnter={e=>{if(!refreshing)e.currentTarget.style.borderColor=C.red;}}
        onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
        <span style={{display:"inline-block",transition:"transform 0.5s",transform:refreshing?"rotate(360deg)":"none"}}>
          <Ic n="refresh" s={15} c={refreshing?C.gray400:C.red}/>
        </span>
        {refreshing?"Atualizando...":"Atualizar"}
      </button>}
    </div>
  );
}

function SLABar({pct,st}){
  const c=st==="late"?C.red:st==="risk"?C.amber:C.green;
  return <div style={{background:C.gray200,borderRadius:2,height:4,overflow:"hidden",flex:1}}><div style={{height:"100%",width:`${Math.min(pct*100,100)}%`,background:c,borderRadius:2}}/></div>;
}

function Stat({label,value,sub,color=C.black,icon,active}){
  return(
    <Card style={{display:"flex",flexDirection:"column",gap:8,...(active?{borderColor:color,boxShadow:`0 0 0 2px ${color}22`}:{})}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{...F.body,fontSize:11,color:C.gray500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
        <Ic n={icon} s={15} c={active?color:C.gray300}/>
      </div>
      <div style={{...F.title,fontSize:30,fontWeight:700,color,lineHeight:1}}>{value}</div>
      {sub&&<div style={{...F.body,fontSize:11,color:C.gray400}}>{sub}</div>}
    </Card>
  );
}

function ETag({etapa}){
  const c=STAGE_COLOR[etapa]||C.gray600;
  return <span style={{display:"inline-flex",alignItems:"center",background:c+"14",color:c,borderRadius:3,padding:"4px 9px",fontSize:11,fontWeight:700,...F.body,whiteSpace:"nowrap",flexShrink:0,lineHeight:1}}>{etapa}</span>;
}

function Btn({label,onClick,variant="primary",size="md",icon,style={},disabled=false}){
  const bg={primary:C.red,secondary:C.white,success:C.green,ghost:"transparent",danger:C.red+"14"}[variant];
  const fg={primary:C.white,secondary:C.gray700,success:C.white,ghost:C.gray600,danger:C.red}[variant];
  const br={primary:"none",secondary:`1px solid ${C.gray200}`,success:"none",ghost:"none",danger:`1px solid ${C.red}30`}[variant];
  const pd={sm:"5px 12px",md:"8px 16px",lg:"11px 22px"}[size];
  const fs={sm:12,md:13,lg:14}[size];
  return(
    <button onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",gap:6,background:bg,color:fg,border:br,borderRadius:6,padding:pd,fontSize:fs,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,...F.body,...style}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity="0.82";}}
      onMouseLeave={e=>{e.currentTarget.style.opacity=disabled?"0.5":"1";}}>
      {icon&&<Ic n={icon} s={13} c={fg}/>}{label}
    </button>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
// Módulos fixados pelo usuário (por navegador). São os 3-4 que a pessoa usa o
// dia inteiro — a separação vive em "Em Separação", a Luiza em "Amostra
// Digital". Ficam no topo, fora dos grupos.
const LS_FIXADOS = "sgp_menu_fixados";
function lerFixados(){
  try { const r = localStorage.getItem(LS_FIXADOS); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
// Normaliza pra busca sem acento: "programacao" acha "Programação".
function semAcento(txt){
  return String(txt||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
}

function Sidebar({user,active,onNav,collapsed,onToggle,chatTotal,contagens}){
  const items=NAV_ITEMS.filter(n=>temAcesso(user,n.id));
  const GRUPOS=GRUPOS_MENU;
  const groups=GRUPOS.map(label=>({label,items:items.filter(n=>n.grupo===label)}));
  const [busca,setBusca]=useState("");
  const [fixados,setFixados]=useState(lerFixados);
  const buscaRef=useRef(null);

  const alternarFixo=(id)=>{
    setFixados(prev=>{
      const novo=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id].slice(0,8);
      try{ localStorage.setItem(LS_FIXADOS,JSON.stringify(novo)); }catch{}
      return novo;
    });
  };

  // Ctrl+K / Cmd+K foca a busca de qualquer lugar do sistema.
  useEffect(()=>{
    const onKey=(e)=>{
      if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==="k"){
        e.preventDefault();
        if(collapsed) onToggle();
        setTimeout(()=>buscaRef.current&&buscaRef.current.focus(),60);
      }
      if(e.key==="Escape"&&document.activeElement===buscaRef.current){ setBusca(""); buscaRef.current.blur(); }
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[collapsed,onToggle]);

  const q=semAcento(busca.trim());
  // Busca casa com o nome do módulo E com o nome do grupo ("faturamento" acha
  // Análise de Frete). Ordena quem começa com o termo primeiro.
  const resultados=q
    ? items.filter(n=>semAcento(n.label).includes(q)||semAcento(n.grupo).includes(q))
        .sort((a,b)=>{
          const ia=semAcento(a.label).startsWith(q)?0:1, ib=semAcento(b.label).startsWith(q)?0:1;
          return ia-ib||a.label.localeCompare(b.label);
        })
    : [];
  const itensFixados=fixados.map(id=>items.find(n=>n.id===id)).filter(Boolean);
  const contarGrupo=(g)=>g.items.reduce((s,n)=>s+(contagens?.[n.id]||0),0);
  // Injeta o CSS da scrollbar sutil uma única vez
  useEffect(()=>{
    if(document.getElementById("sgp-scroll-style"))return;
    const st=document.createElement("style");
    st.id="sgp-scroll-style";
    st.textContent=`
      .sgp-scroll{scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .25s;}
      .sgp-scroll:hover{scrollbar-color:rgba(158,11,15,0.28) transparent;}
      .sgp-scroll::-webkit-scrollbar{width:6px;height:6px;}
      .sgp-scroll::-webkit-scrollbar-track{background:transparent;}
      .sgp-scroll::-webkit-scrollbar-thumb{background-color:transparent;border-radius:8px;border:1px solid transparent;background-clip:content-box;transition:background-color .25s;}
      .sgp-scroll:hover::-webkit-scrollbar-thumb{background-color:rgba(158,11,15,0.22);}
      .sgp-scroll::-webkit-scrollbar-thumb:hover{background-color:rgba(158,11,15,0.5);}
    `;
    document.head.appendChild(st);
  },[]);
  return(
    <div style={{width:collapsed?56:272,background:C.white,borderRight:`1px solid ${C.gray200}`,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",flexShrink:0}}>
      <div style={{padding:collapsed?"14px":"16px 20px",borderBottom:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",minHeight:56,gap:8}}>
        {!collapsed&&<div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={BRASAO_SGP} alt="SGP" style={{height:28,width:"auto",flexShrink:0,display:"block"}}/>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{...F.title,fontSize:14,fontWeight:700,color:C.black,letterSpacing:"0.05em",lineHeight:1}}>SGP</div>
            <div style={{...F.body,fontSize:8.5,color:C.gray400,letterSpacing:"0.02em",lineHeight:1.2,marginTop:2}}>GESTÃO DE PERSONALIZADOS</div>
          </div>
        </div>}
        <button onClick={onToggle} style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:5,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
          <Ic n={collapsed?"chevR":"chevL"} s={12} c={C.gray500}/>
        </button>
      </div>
      {/* Busca — atalho Ctrl+K. Com 47 módulos, procurar visualmente é o gargalo. */}
      {!collapsed&&
        <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.gray200}`}}>
          <div style={{display:"flex",alignItems:"center",gap:7,border:`1px solid ${C.gray200}`,borderRadius:7,padding:"7px 9px",background:C.white}}>
            <Ic n="search" s={13} c={C.gray400}/>
            <input ref={buscaRef} value={busca} onChange={e=>setBusca(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&resultados.length){ onNav(resultados[0].id); setBusca(""); e.currentTarget.blur(); } }}
              placeholder="Buscar módulo"
              style={{flex:1,minWidth:0,border:"none",outline:"none",...F.body,fontSize:12.5,background:"transparent",color:C.black}}/>
            {busca
              ? <span onClick={()=>setBusca("")} style={{cursor:"pointer",display:"flex"}}><Ic n="close" s={12} c={C.gray400}/></span>
              : <span style={{...F.body,fontSize:9.5,color:C.gray400,border:`1px solid ${C.gray200}`,borderRadius:4,padding:"1px 4px",whiteSpace:"nowrap"}}>Ctrl K</span>}
          </div>
        </div>}

      <div className="sgp-scroll" style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
        {/* Resultados da busca substituem o menu inteiro enquanto há termo. */}
        {!collapsed&&q&&<>
          {resultados.length===0&&<div style={{...F.body,fontSize:12,color:C.gray400,padding:"14px 20px"}}>Nenhum módulo encontrado.</div>}
          {resultados.map((n,i)=>(
            <div key={n.id} onClick={()=>{onNav(n.id);setBusca("");}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"8px 20px",cursor:"pointer",background:i===0?C.red+"0e":"transparent",borderLeft:i===0?`2px solid ${C.red}`:"2px solid transparent"}}
              onMouseEnter={e=>{if(i!==0)e.currentTarget.style.background=C.gray50;}}
              onMouseLeave={e=>{if(i!==0)e.currentTarget.style.background="transparent";}}>
              <Ic n={n.icon} s={15} c={i===0?C.red:C.gray500}/>
              <span style={{...F.body,fontSize:13,color:i===0?C.red:C.gray700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n.label}</span>
              <span style={{marginLeft:"auto",...F.body,fontSize:10,color:C.gray400,whiteSpace:"nowrap"}}>{n.grupo}</span>
            </div>
          ))}
        </>}

        {/* FIXADOS — atalho pessoal, some durante a busca. */}
        {!q&&itensFixados.length>0&&
          <div style={{marginBottom:4,paddingBottom:6,borderBottom:`1px solid ${C.gray100}`}}>
            {!collapsed&&<div style={{...F.body,fontSize:9,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.1em",padding:"10px 20px 4px"}}>Fixados</div>}
            {itensFixados.map(n=>(
              <MenuItem key={"fix-"+n.id} n={n} collapsed={collapsed} active={active} onNav={onNav}
                chatTotal={chatTotal} contagens={contagens} fixo onFixar={alternarFixo}/>
            ))}
          </div>}

        {!q&&groups.map(g => (
          <MenuGrupo
            key={g.label}
            grupo={g}
            collapsed={collapsed}
            active={active}
            onNav={onNav}
            chatTotal={chatTotal}
            contagens={contagens}
            total={contarGrupo(g)}
            fixados={fixados}
            onFixar={alternarFixo}
          />
        ))}
      </div>
      {!collapsed&&<div style={{padding:"12px 16px",borderTop:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",gap:10}}>
        <Av ini={user.ini} size={30}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{...F.body,fontSize:12,fontWeight:700,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(user.nome||user.name||"").split(" ")[0]}</div>
          <div style={{...F.body,fontSize:10,color:C.gray500}}>{user.admin?"Administrador":"Operador"} · {SGP_VERSION}</div>
        </div>
      </div>}
    </div>
  );
}

// Item do menu — extraído pra que os hooks (useState) fiquem no topo do componente,
// respeitando a regra dos Hooks do React (evita o erro #300).
// Uma linha do menu. Extraído pra ser reusado pelos Fixados e pelos grupos.
// A estrela só aparece no hover — não polui, mas está sempre a um clique.
function MenuItem({n, collapsed, active, onNav, chatTotal, contagens, fixo, onFixar}) {
  const [hover, setHover] = useState(false);
  const on = active === n.id;
  const badge = (n.id === "chat" && chatTotal > 0) ? chatTotal : 0;
  const qtd = contagens ? (contagens[n.id] || 0) : 0;
  return (
    <div onClick={()=>onNav(n.id)}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px 0":"8px 20px",cursor:"pointer",
        background:on?C.red+"0e":(hover?C.gray50:"transparent"),
        borderLeft:on?`2px solid ${C.red}`:"2px solid transparent",
        color:on?C.red:C.gray600,justifyContent:collapsed?"center":"flex-start",position:"relative"}}>
      <div style={{position:"relative",display:"flex"}}>
        <Ic n={n.icon} s={15} c={on?C.red:C.gray500}/>
        {collapsed&&badge>0&&<span style={{position:"absolute",top:-6,right:-8,background:C.red,color:C.white,borderRadius:9,fontSize:9,fontWeight:800,padding:"1px 5px",...F.body}}>{badge>9?"9+":badge}</span>}
      </div>
      {!collapsed&&<span style={{...F.body,fontSize:13,fontWeight:on?600:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n.label}</span>}
      {!collapsed&&<span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
        {onFixar&&(hover||fixo)&&
          <span title={fixo?"Desafixar do topo":"Fixar no topo"}
            onClick={e=>{e.stopPropagation();onFixar(n.id);}}
            style={{display:"flex",cursor:"pointer"}}>
            <Ic n="pin" s={12} c={fixo?C.red:C.gray300}/>
          </span>}
        {badge>0
          ? <span style={{background:C.red,color:C.white,borderRadius:10,fontSize:10,fontWeight:800,padding:"1px 7px",...F.body}}>{badge}</span>
          : qtd>0
            ? <span style={{...F.body,fontSize:10.5,fontWeight:700,color:on?C.red:C.gray400}}>{qtd}</span>
            : null}
      </span>}
    </div>
  );
}

// Grupo do menu. TODOS colapsam agora (antes só "Outros" e "Cadastros"), e o
// padrão é fechado — com 47 módulos abertos, o menu virava uma parede de texto.
// O grupo do módulo ativo abre sozinho, então navegar nunca deixa o usuário
// perdido. A escolha de cada grupo fica salva por usuário.
function MenuGrupo({grupo, collapsed, active, onNav, chatTotal, contagens, total, fixados, onFixar}) {
  const gi = grupo.items;
  const temAtivo = gi.some(n => n.id === active);
  const chaveLS = "sgp_menu_grupo_" + grupo.label;
  const [aberto, setAberto] = useState(() => {
    // Principal fica sempre aberto: são os painéis de entrada do sistema.
    if (grupo.label === "Principal") return true;
    const salvo = typeof localStorage !== "undefined" ? localStorage.getItem(chaveLS) : null;
    return salvo === null ? false : salvo === "1";
  });
  // Ao navegar pra um módulo de outro grupo, abre o grupo dele.
  useEffect(()=>{ if(temAtivo) setAberto(true); },[temAtivo]);
  const podeColapsar = grupo.label !== "Principal";
  const toggle = () => {
    setAberto(v => {
      const novo = !v;
      try { localStorage.setItem(chaveLS, novo ? "1" : "0"); } catch {}
      return novo;
    });
  };
  if (!gi.length) return null;
  return (
    <div style={{marginBottom:2}}>
      {!collapsed && (
        <div
          onClick={podeColapsar ? toggle : undefined}
          style={{
            ...F.body, fontSize:9, fontWeight:700, color:C.gray400,
            textTransform:"uppercase", letterSpacing:"0.1em",
            padding:"10px 20px 4px",
            display:"flex", alignItems:"center", gap:6,
            cursor: podeColapsar ? "pointer" : "default",
            userSelect: "none",
          }}
        >
          <span>{grupo.label}</span>
          {/* Total do grupo quando fechado: mostra onde tem trabalho sem abrir. */}
          {!aberto && total > 0 &&
            <span style={{...F.body,fontSize:9.5,fontWeight:700,color:C.gray500,background:C.gray100,borderRadius:8,padding:"1px 6px"}}>{total}</span>}
          {podeColapsar && (
            <span style={{marginLeft:"auto",display:"inline-flex", transition:"transform 0.15s", transform: aberto ? "rotate(0deg)" : "rotate(-90deg)"}}>
              <Ic n="chevDown" s={10} c={C.gray400}/>
            </span>
          )}
        </div>
      )}
      {(collapsed || !podeColapsar || aberto) && gi.map(n => (
        <MenuItem key={n.id} n={n} collapsed={collapsed} active={active} onNav={onNav}
          chatTotal={chatTotal} contagens={contagens}
          fixo={!!(fixados&&fixados.includes(n.id))} onFixar={onFixar}/>
      ))}
    </div>
  );
}

function BottomNav({user,active,onNav}){
  const allItems=NAV_ITEMS.filter(n=>temAcesso(user,n.id));
  const mainItems=allItems.slice(0,4);
  const [showDrawer,setShowDrawer]=useState(false);

  const GRUPOS=GRUPOS_MENU;
  const groups=GRUPOS.map(label=>({label,items:allItems.filter(n=>n.grupo===label)}));

  return(
    <>
      {/* Drawer de menu completo */}
      {showDrawer&&(
        <div style={{position:"fixed",inset:0,zIndex:200}} onClick={()=>setShowDrawer(false)}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.white,borderRadius:"16px 16px 0 0",boxShadow:"0 -4px 24px rgba(0,0,0,0.15)",maxHeight:"80vh",overflow:"auto"}}
            onClick={e=>e.stopPropagation()}>
            {/* Handle */}
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}>
              <div style={{width:36,height:4,borderRadius:2,background:C.gray300}}/>
            </div>
            <div style={{padding:"4px 0 16px"}}>
              {groups.map(g=>{
                const gi=g.items;
                if(!gi.length)return null;
                return(
                  <div key={g.label}>
                    <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.1em",padding:"10px 20px 6px"}}>{g.label}</div>
                    {gi.map(n=>(
                      <div key={n.id} onClick={()=>{onNav(n.id);setShowDrawer(false);}}
                        style={{display:"flex",alignItems:"center",gap:14,padding:"11px 20px",cursor:"pointer",background:active===n.id?C.red+"0e":"transparent",borderLeft:active===n.id?`3px solid ${C.red}`:"3px solid transparent"}}
                        onMouseEnter={e=>{if(active!==n.id)e.currentTarget.style.background=C.gray50;}}
                        onMouseLeave={e=>{if(active!==n.id)e.currentTarget.style.background="transparent";}}>
                        <Ic n={n.icon} s={18} c={active===n.id?C.red:C.gray500}/>
                        <span style={{...F.body,fontSize:14,fontWeight:active===n.id?700:400,color:active===n.id?C.red:C.black}}>{n.label}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.gray200}`,display:"flex",zIndex:100}}>
        {mainItems.map(n=>(
          <div key={n.id} onClick={()=>onNav(n.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"9px 4px 8px",cursor:"pointer",color:active===n.id?C.red:C.gray500}}>
            <Ic n={n.icon} s={20} c={active===n.id?C.red:C.gray400}/>
            <span style={{...F.body,fontSize:9,marginTop:3,fontWeight:active===n.id?700:400,textAlign:"center",lineHeight:1.1}}>{n.label.split(" ")[0]}</span>
          </div>
        ))}
        {/* Botão Menu */}
        <div onClick={()=>setShowDrawer(true)}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"9px 4px 8px",cursor:"pointer",color:showDrawer?C.red:C.gray500}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={showDrawer?C.red:C.gray400} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
          <span style={{...F.body,fontSize:9,marginTop:3,fontWeight:showDrawer?700:400,textAlign:"center",lineHeight:1.1}}>Menu</span>
        </div>
      </div>
    </>
  );
}

function Topbar({user,title,naoLidas,onBell,onLogout,isMobile}){
  return(
    <div style={{height:56,background:C.white,borderBottom:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0}}>
      <div style={{...F.title,fontSize:isMobile?13:15,fontWeight:600,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title.toUpperCase()}</div>
      <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
        <div onClick={onBell} style={{position:"relative",cursor:"pointer",display:"flex",alignItems:"center"}}>
          <Ic n="bell" s={19} c={naoLidas>0?C.red:C.gray500}/>
          {naoLidas>0&&<span style={{position:"absolute",top:-6,right:-6,background:C.red,color:C.white,borderRadius:9,minWidth:15,height:15,padding:"0 3px",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",...F.body}}>{naoLidas>9?"9+":naoLidas}</span>}
        </div>
        <Av ini={user.ini} size={30}/>
        {!isMobile&&<button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center"}}><Ic n="logout" s={16} c={C.gray400}/></button>}
      </div>
    </div>
  );
}

// ─── CHAT (conversa do pedido — persistida no Supabase) ──────────────────────
function Chat({order,me,usuarios}){
  const pedidoId=String(order.vendasId||"").replace(/^PED-/,"")||String(order.id||"").replace(/^PED-/,"");
  const [msgs,setMsgs]=useState(null);
  const [msg,setMsg]=useState("");
  const [showM,setShowM]=useState(false);
  const [mq,setMq]=useState("");
  const [enviando,setEnviando]=useState(false);
  const [users,setUsers]=useState(usuarios||[]);
  const [files,setFiles]=useState([]);   // File[] selecionados p/ anexar
  const [preview,setPreview]=useState(null);
  const eRef=useRef(null);
  const fileRef=useRef(null);
  // Separa texto e anexos embutidos (marcador §§ANEXOS§§) de uma mensagem.
  const parseMsg=(raw)=>{
    const s=String(raw||""); const i=s.indexOf("\n§§ANEXOS§§");
    if(i===-1) return {texto:s, anexos:[]};
    let anexos=[]; try{ anexos=JSON.parse(s.slice(i+"\n§§ANEXOS§§".length))||[]; }catch{ anexos=[]; }
    return {texto:s.slice(0,i), anexos};
  };
  const ehImg=(n="")=>/\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(n);

  const carregar=()=>apiFetch("/conversa/"+encodeURIComponent(pedidoId))
    .then(r=>setMsgs(r.data||[])).catch(()=>setMsgs([]));
  useEffect(()=>{carregar();},[pedidoId]);
  // Sempre busca a lista de usuários mais atual ao abrir (para a menção)
  useEffect(()=>{
    apiFetch("/usuarios").then(r=>{
      const lista=r?.users||r?.usuarios||r?.data||(Array.isArray(r)?r:[]);
      if(Array.isArray(lista)&&lista.length)setUsers(lista);
    }).catch(()=>{});
  },[]);
  useEffect(()=>{ if(usuarios&&usuarios.length)setUsers(usuarios); },[usuarios]);
  useEffect(()=>{eRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const primeiroNome=u=>(u.nome||u.name||u.email||"").trim().split(" ")[0];
  const lista=(users||[]).filter(u=>(u.email||"")!==me.email&&u.ativo!==false);
  const fu=lista.filter(u=>mq===""||(u.nome||"").toLowerCase().includes(mq)||(u.email||"").toLowerCase().includes(mq));

  const hc=v=>{setMsg(v);const at=v.lastIndexOf("@");if(at!==-1&&v.slice(at+1).match(/^[\wÀ-ÿ]*$/)){setShowM(true);setMq(v.slice(at+1).toLowerCase());}else setShowM(false);};
  const ins=u=>{const at=msg.lastIndexOf("@");setMsg(msg.slice(0,at)+"@"+primeiroNome(u)+" ");setShowM(false);};

  const send=async()=>{
    if((!msg.trim()&&files.length===0)||enviando)return;
    // Mencionados: usuários cujo primeiro nome aparece como @nome no texto.
    // Boundary unicode-aware: o nome não pode ser seguido de outra letra/número
    // (evita @Ana casar com "@Anabela") e funciona com acentos.
    const mencionados=lista.filter(u=>{
      const fn=primeiroNome(u).toLowerCase();
      if(!fn)return false;
      try{ return new RegExp("@"+fn.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}\\p{N}])","iu").test(msg); }
      catch{ return msg.toLowerCase().includes("@"+fn); }
    }).map(u=>u.email);
    setEnviando(true);
    try{
      // Converte os arquivos selecionados em base64 pra subir junto.
      const anexos=[];
      for(const f of files){
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
        anexos.push({base64,nome:f.name});
      }
      await apiFetch("/conversa/"+encodeURIComponent(pedidoId),"POST",{
        autor:me.nome||me.name||me.email, autorEmail:me.email,
        mensagem:msg.trim(), mencionados, cliente:order.client||"",
        anexos,
      });
      setMsg("");setShowM(false);setFiles([]);
      await carregar();
    }catch(e){alert("Erro ao enviar: "+e.message);}
    finally{setEnviando(false);}
  };

  const fmtMsgData=(iso)=>{if(!iso)return"";const d=new Date(iso);return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;};
  const ini=(nome)=>(nome||"?").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}} className="sgp-scroll">
        {msgs===null&&<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",marginTop:20}}>Carregando conversa...</div>}
        {msgs!==null&&msgs.length===0&&<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",marginTop:20}}>Nenhuma mensagem ainda. Use @ para mencionar alguém.</div>}
        {(msgs||[]).map((m,i)=>{
          const isMe=(m.autor_email||"")===me.email;
          return(
            <div key={m.id||i} style={{display:"flex",gap:8}}>
              <Av ini={ini(m.autor)} size={28} bg={isMe?C.red:C.gray700}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:8,alignItems:"baseline",flexWrap:"wrap"}}>
                  <span style={{...F.body,fontSize:12,fontWeight:700,color:C.black}}>{m.autor||"—"}</span>
                  <span style={{...F.body,fontSize:10,color:C.gray400}}>{fmtMsgData(m.criado_em)}</span>
                </div>
                {(()=>{ const {texto,anexos}=parseMsg(m.mensagem); return <>
                  {texto.trim()&&<div style={{...F.body,fontSize:13,color:C.gray700,marginTop:4,lineHeight:1.6,background:C.gray50,borderRadius:6,padding:"8px 12px",border:`1px solid ${C.gray200}`,wordBreak:"break-word"}}>
                    {texto.split(/(@[\wÀ-ÿ]+)/).map((p,j)=>p.startsWith("@")?<span key={j} style={{color:C.red,fontWeight:700}}>{p}</span>:p)}
                  </div>}
                  {anexos.length>0&&<div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:8}}>
                    {anexos.map((a,j)=>{const im=ehImg(a.nome); return (
                      <div key={j} onClick={()=>setPreview(a)} title="Ver / baixar"
                        style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.gray200}`,borderRadius:8,padding:im?4:"8px 10px",background:C.white,cursor:"pointer",maxWidth:220}}>
                        {im&&a.url
                          ?<img src={a.url} alt={a.nome} style={{width:44,height:44,objectFit:"cover",borderRadius:6,flexShrink:0}}/>
                          :<div style={{width:32,height:32,borderRadius:6,background:C.red+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="download" s={15} c={C.red}/></div>}
                        <span style={{...F.body,fontSize:11,color:C.gray700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nome}</span>
                      </div>
                    );})}
                  </div>}
                </>; })()}
              </div>
            </div>
          );
        })}
        <div ref={eRef}/>
      </div>
      <div style={{padding:"10px 16px",borderTop:`1px solid ${C.gray200}`,position:"relative"}}>
        {showM&&fu.length>0&&<div style={{position:"absolute",bottom:70,left:16,right:16,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",zIndex:10,maxHeight:180,overflowY:"auto"}}>
          {fu.slice(0,6).map(u=>(
            <div key={u.email} onClick={()=>ins(u)} style={{padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}
              onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
              onMouseLeave={e=>e.currentTarget.style.background=C.white}>
              <Av ini={ini(u.nome||u.name)} size={22}/>
              <span style={{...F.body,fontSize:13,fontWeight:600}}>{u.nome||u.name}</span>
              <span style={{...F.body,fontSize:11,color:C.gray400}}>{u.email||""}</span>
            </div>
          ))}
        </div>}
        {files.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
          {files.map((f,idx)=>(
            <div key={idx} style={{display:"flex",alignItems:"center",gap:6,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"5px 8px",...F.body,fontSize:11,color:C.gray700}}>
              <Ic n="box" s={12} c={C.gray500}/> <span style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
              <button onClick={()=>setFiles(fs=>fs.filter((_,i)=>i!==idx))} style={{background:"none",border:"none",cursor:"pointer",color:C.gray400,fontSize:14,lineHeight:1}}>✕</button>
            </div>
          ))}
        </div>}
        <div style={{display:"flex",gap:8}}>
          <input type="file" multiple ref={fileRef} style={{display:"none"}}
            onChange={e=>{const fl=Array.from(e.target.files||[]);if(fl.length)setFiles(fs=>[...fs,...fl]);setTimeout(()=>{if(e.target)e.target.value="";},0);}}/>
          <button onClick={()=>fileRef.current&&fileRef.current.click()} title="Anexar arquivo"
            style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 11px",cursor:"pointer",display:"flex",alignItems:"center"}}>
            <Ic n="box" s={15} c={C.gray600}/>
          </button>
          <input value={msg} onChange={e=>hc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Mensagem... @ para mencionar"
            style={{flex:1,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",...F.body}}/>
          <button onClick={send} disabled={enviando} style={{background:enviando?C.gray300:C.red,color:C.white,border:"none",borderRadius:6,padding:"9px 14px",cursor:enviando?"wait":"pointer",display:"flex",alignItems:"center"}}>
            <Ic n="send" s={15} c={C.white}/>
          </button>
        </div>
        <div style={{...F.body,fontSize:10,color:C.gray400,marginTop:5}}>Todos no pedido veem a conversa. Quem for mencionado com @ recebe uma notificação. Dá pra anexar prints, planilhas, etc.</div>
        {preview&&<FileLightbox file={preview} onClose={()=>setPreview(null)}/>}
      </div>
    </div>
  );
}

// ─── ABA ALTERAÇÃO DE FORMULÁRIO ─────────────────────────────────────────────
function AlteracaoFormTab({order,onAction,me}){
  const [novaEtapa,setNovaEtapa]=useState("");
  const [motivo,setMotivo]=useState("");
  const [enviando,setEnviando]=useState(false);
  const [ok,setOk]=useState(false);

  // Bloqueio: não pode alterar se já está em produção de bordado
  const bloqueado=order.etapa==="Bordado Interno"||order.etapa==="Bordado Externo"||order.etapa==="Bordado Interno e Externo";

  // Etapas para as quais o pedido pode voltar
  const etapasDestino=[
    "Programação","Amostra Digital","Aprovação de Amostra Digital",
    "Amostra Física","Aprovação de Amostra Física","Liberado para bordar",
  ];

  const enviar=async()=>{
    if(!novaEtapa){alert("Selecione para qual etapa o pedido deve voltar.");return;}
    if(!motivo.trim()){alert("Informe o motivo da alteração.");return;}
    setEnviando(true);
    try{
      await onAction(order.id,"alteracao_formulario",{novaEtapa,motivo:motivo.trim()});
      setOk(true);
    }catch(e){
      alert("Erro ao registrar alteração: "+e.message);
    }finally{setEnviando(false);}
  };

  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      {/* Histórico de alteração (se já houve) */}
      {order.houveAlteracaoForm&&(
        <div style={{background:"#f97316"+"12",border:`1.5px solid #f97316`,borderRadius:8,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <Ic n="warn" s={16} c="#f97316"/>
            <span style={{...F.title,fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:"0.06em"}}>JÁ HOUVE ALTERAÇÃO DE FORMULÁRIO</span>
          </div>
          <div style={{...F.body,fontSize:10,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo registrado</div>
          <div style={{...F.body,fontSize:13,color:"#7c2d12"}}>{order.motivoAlteracaoForm||"—"}</div>
        </div>
      )}

      {ok?(
        <div style={{padding:30,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:C.green+"14",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={24} c={C.green}/></div>
          <div style={{...F.title,fontSize:16,fontWeight:700,color:C.green}}>ALTERAÇÃO REGISTRADA</div>
          <div style={{...F.body,fontSize:13,color:C.gray500,textAlign:"center",maxWidth:380}}>O pedido foi retornado para a etapa solicitada e a alteração ficou registrada na timeline.</div>
        </div>
      ):bloqueado?(
        <div style={{background:C.red+"0e",border:`1px solid ${C.red}30`,borderRadius:8,padding:"16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <Ic n="close" s={16} c={C.red}/>
            <span style={{...F.title,fontSize:13,fontWeight:700,color:C.red}}>ALTERAÇÃO NÃO PERMITIDA</span>
          </div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>Este pedido já está em produção de bordado ({order.etapa}). Não é possível solicitar alteração de formulário nesta fase.</div>
        </div>
      ):(
        <>
          <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
            <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>SOLICITAR ALTERAÇÃO DE FORMULÁRIO</div>
            <div style={{...F.body,fontSize:13,color:C.gray600}}>Use quando o cliente solicitar mudança no pedido. Isso retorna o pedido para a etapa escolhida e gera registro (causa atraso no processo).</div>
          </div>

          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Voltar o pedido para a etapa</label>
            <select value={novaEtapa} onChange={e=>setNovaEtapa(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:C.white,cursor:"pointer"}}>
              <option value="">Selecione a etapa...</option>
              {etapasDestino.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Motivo da alteração <span style={{color:C.red}}>*</span></label>
            <textarea value={motivo} onChange={e=>setMotivo(e.target.value)} rows={4} placeholder="Descreva o que o cliente solicitou alterar..."
              style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
          </div>

          <button onClick={enviar} disabled={enviando}
            style={{background:enviando?"#ccc":"#f97316",color:C.white,border:"none",borderRadius:8,padding:"12px 24px",cursor:enviando?"wait":"pointer",...F.body,fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
            <Ic n="warn" s={15} c={C.white}/> {enviando?"Registrando...":"Registrar alteração e voltar etapa"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── ABA ALTERAÇÃO DE FORMULÁRIO (fim) ───────────────────────────────────────
function Timeline({order}){
  // Usa o histórico real vindo do HubSpot (registra todas as mudanças,
  // inclusive reversões manuais). Fallback para o timeline local antigo.
  const hist=(order.historico&&order.historico.length>0)
    ? order.historico
    : (order.timeline||[]).map(t=>({stage:t.stage,who:t.user,enteredAt:t.enteredAt,exitedAt:t.exitedAt,durMin:t.dH!=null?Math.round(t.dH*60):null,origem:""}));

  if(hist.length===0)return <div style={{padding:40,textAlign:"center",...F.body,color:C.gray400,fontSize:13}}>Nenhum histórico de etapas registrado.</div>;

  // Separa por origem (Bordado vs Pós-Venda) — são fluxos paralelos, agrupá-los
  // deixa a evolução de cada pipeline mais legível que uma lista misturada.
  const bord = hist.filter(t => t.origem === "Bordado");
  const pv = hist.filter(t => t.origem === "Pós-venda");
  const semOrigem = hist.filter(t => !t.origem);
  const temAmbos = bord.length > 0 && pv.length > 0;

  const renderGrupo = (lista, corDot, corFundo, titulo) => {
    if (!lista.length) return null;
    return (
      <div style={{marginBottom:24}}>
        {titulo && <div style={{...F.title,fontSize:11,fontWeight:700,color:corDot,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,paddingLeft:6,borderLeft:`3px solid ${corDot}`}}>{titulo}</div>}
        {lista.map((t,i)=>{
          const act=i===lista.length-1 && !t.exitedAt;
          return(
          <div key={i} style={{display:"flex",gap:14,marginBottom:18,position:"relative"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:act?C.red:corDot,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1}}>
                <Ic n={act?"up":"check"} s={12} c={C.white}/>
              </div>
              {i<lista.length-1&&<div style={{width:1,flex:1,background:C.gray200,marginTop:4,minHeight:16}}/>}
            </div>
            <div style={{flex:1,paddingTop:4}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,alignItems:"center"}}>
                <span style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{t.stage}</span>
                {act&&<Tag label="Em andamento" color={C.red}/>}
              </div>
              <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>Por: {t.who||(t.exitedAt?"Sistema":"—")}</div>
              <div style={{...F.body,fontSize:11,color:C.gray600,marginTop:3}}>
                Entrada: {fmtD(t.enteredAt)}{t.exitedAt&&<> · Saída: {fmtD(t.exitedAt)}</>}
              </div>
              {t.durMin!=null&&<div style={{...F.body,fontSize:11,marginTop:2}}>Permaneceu: <strong style={{color:t.durMin>1440?C.red:C.green}}>{fmtDur(t.durMin)}</strong></div>}
              {t.durMin==null&&act&&<div style={{...F.body,fontSize:11,marginTop:2,color:C.amber,fontWeight:600}}>Em andamento</div>}
            </div>
          </div>
        );})}
      </div>
    );
  };

  return(
    <div style={{padding:20}}>
      {temAmbos && (
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"8px 12px",marginBottom:16,...F.body,fontSize:11,color:C.gray600}}>
          ℹ️ Pós-Venda e Bordado são <strong>fluxos paralelos</strong>. Cada um tem sua própria evolução de etapas.
        </div>
      )}
      {renderGrupo(pv, C.teal, null, temAmbos ? "Pós-Venda" : null)}
      {renderGrupo(bord, C.purple, null, temAmbos ? "Bordado" : null)}
      {renderGrupo(semOrigem, C.gray500, null, null)}
    </div>
  );
}


// ─── EXECUÇÃO POR BORDADO (Programação: c/ dificuldade · Amostra: s/ dificuldade) ─
function ExecPorBordado({order,etapa,onAction,comDificuldade,setActionMsg,setActionDone,loadingDet,me,setTemPendencias}){
  const ehAmostra=etapa!=="Programação";
  const [previewExec,setPreviewExec]=useState(null); // arquivo em pré-visualização
  const todos=(order.bordadosJson||[]).filter(b=>b&&(b.fileName||b.fileId));
  const filtro=ehAmostra?/~(prog|amostra)/i:/~prog/i;
  let bordados=todos.filter(b=>filtro.test(b.fileName||""));
  if(!bordados.length) bordados=todos;
  // Demanda de programação = 1 card por ARQUIVO (fileId). Todos os produtos/
  // posições do mesmo arquivo entram num card só; a programadora é quem informa
  // quantas programações aquele arquivo exigiu (ex.: peito e costas = 2) e a
  // dificuldade de cada uma. Entradas sem fileId caem no fallback por nome.
  const chaveDemanda=(b)=>{
    if(b&&b.fileId) return String(b.fileId);
    return b&&b.fileName?("nome:"+b.fileName):"";
  };
  bordados=(()=>{
    const vistos=new Set(); const out=[];
    for(const b of bordados){
      const chave=chaveDemanda(b);
      if(chave){ if(vistos.has(chave)) continue; vistos.add(chave); }
      out.push(b);
    }
    return out;
  })();
  // "Onde vai": a extensão do vendedor replica o MESMO fileId quando vincula
  // vários produtos a um arquivo. Aqui agrupamos TODOS os registros por arquivo
  // pra mostrar, num card só, a lista de produto + posição de cada produto.
  const combosPorArquivo={};
  for(const b of todos){
    const fid=b&&b.fileId?String(b.fileId):("nome:"+((b&&b.fileName)||""));
    (combosPorArquivo[fid]=combosPorArquivo[fid]||[]).push({sku:(b&&b.sku)||"",productName:(b&&b.productName)||"",positionLabel:(b&&b.positionLabel)||""});
  }
  const combosDe=(b)=>{
    const fid=b&&b.fileId?String(b.fileId):("nome:"+((b&&b.fileName)||""));
    // dedup por (produto+posição) pra não repetir se o bordados_json tiver duplicatas exatas
    const seen=new Set(); const out=[];
    for(const c of (combosPorArquivo[fid]||[])){
      const key=(c.sku||c.productName)+"|"+c.positionLabel;
      if(seen.has(key)) continue; seen.add(key); out.push(c);
    }
    return out;
  };
  const RenderCombos=({b})=>{
    const cs=combosDe(b);
    if(!cs.length) return b.positionLabel?<span style={{color:"#6b21a8"}}>📍 {b.positionLabel}</span>:null;
    return <>{cs.map((c,ci)=>(
      <span key={ci}>{ci>0?<span style={{color:C.gray300}}> • </span>:null}👕 {c.productName||c.sku}{c.positionLabel?<span style={{color:"#6b21a8"}}> 📍 {c.positionLabel}</span>:null}</span>
    ))}</>;
  };
  // Lógica de assumir tarefa — só aplica na Programação. Múltiplos usuários
  // podem assumir bordados diferentes do mesmo pedido, mas só quem assumiu
  // pode executar aquele bordado específico.
  const ehProgAssumivel = etapa==="Programação";
  // Estado local: quando o usuário assume/executa, atualizamos localmente
  // pra feedback imediato. Mas sincronizamos SEMPRE com o order (que é a
  // fonte da verdade vinda do backend).
  const [assumidosLocal, setAssumidosLocal] = useState(null);
  const [executadosLocal, setExecutadosLocal] = useState(null);
  const assumidos = assumidosLocal !== null ? assumidosLocal : (order.programacaoAssumidos || []);
  const executados = executadosLocal !== null ? executadosLocal : (order.programacaoExecutados || []);
  const setAssumidos = setAssumidosLocal;
  const setExecutados = setExecutadosLocal;
  // Reset do estado local quando o order muda (nova abertura de modal)
  useEffect(() => {
    setAssumidosLocal(null);
    setExecutadosLocal(null);
  }, [order.bordadoId, order.posvendaId]);
  const [assumindoKey, setAssumindoKey] = useState(null);
  // Match tolerante: extrai o "sku_timestamp.ext" que é o único ID único.
  // Formato típico: "08.01.0119 - Bordado ... 62465544753 OSCAR CANDIDO ~PROG_1783716087395.jpg"
  //                  SKU^^^^^^^^                                     timestamp^^^^^^^^^^^^^ .jpg
  // Extraímos SKU (primeiros dígitos) + timestamp (número antes de .ext).
  const extrairChave = (n = "") => {
    const s = String(n || "");
    const sku = (s.match(/^\s*([\d.\-]{4,})/) || [])[1] || "";
    const ts = (s.match(/(\d{10,})/g) || []).slice(-1)[0] || "";
    return sku.replace(/[.\-]+$/, "") + "|" + ts;
  };
  const findAssumido = (fileName) => {
    const chave = extrairChave(fileName);
    return assumidos.find(a => extrairChave(a.fileName || a.nomeArquivo) === chave);
  };
  const findExecutado = (fileName) => {
    const chave = extrairChave(fileName);
    return executados.find(a => extrairChave(a.nomeArquivo || a.fileName) === chave);
  };
  const meuId = String(me?.id || me?.email || me?.nome || "user");
  const meuNome = me?.nome || me?.email || "Usuário";
  const assumirBordado = async (b, forcar=false) => {
    if (!order.bordadoId) { alert("Pedido sem negócio de Bordado."); return; }
    setAssumindoKey(b.fileName);
    try {
      const r = await apiFetch("/programacao-assumir","POST",{
        bordadoId: order.bordadoId, fileName: b.fileName || "",
        userId: meuId, userName: meuNome, forcar,
      });
      if (r.success) setAssumidos(r.assumidos);
      else alert("Não foi possível assumir: " + (r.error||"erro desconhecido"));
    } catch(e) {
      // 409 = já assumido por outra pessoa (tela pode estar defasada). Oferece
      // tomar a programação pra si e reenvia forçando.
      if (!forcar && String(e.message||"").includes("409")) {
        setAssumindoKey(null);
        if (confirm("Este bordado já foi assumido por outra pessoa (ou a tela está desatualizada).\n\nDeseja assumir mesmo assim, tomando a programação pra você?")) {
          return assumirBordado(b, true);
        }
        return;
      }
      alert("Erro: "+e.message);
    }
    setAssumindoKey(null);
  };
  const liberarBordado = async (b) => {
    if (!order.bordadoId) return;
    if (!confirm("Deseja liberar este bordado pra outro programador?")) return;
    try {
      const r = await apiFetch("/programacao-liberar","POST",{
        bordadoId: order.bordadoId, fileName: b.fileName || "", userId: meuId,
      });
      if (r.success) setAssumidos(r.assumidos);
      else alert("Erro: "+(r.error||"desconhecido"));
    } catch(e) { alert("Erro: "+e.message); }
  };
  // Dispensar programação: marca o bordado como "não precisa programar"
  // (bordado igual a outro já programado, ou já existe programação anterior).
  // Adiciona ao programacao_executados sem anexar arquivo. Só disponível se
  // etapa é Programação.
  const [dispensandoKey, setDispensandoKey] = useState(null);
  // Seleção múltipla (tabela de execução) + ações em massa.
  const [selKeys, setSelKeys] = useState(() => new Set());
  const [bulkBusy, setBulkBusy] = useState("");
  // Faz a dispensa com o motivo JÁ pronto (reusado no individual e no em massa).
  const dispensarComMotivo = async (b, motivo) => {
    const r = await apiFetch("/programacao-dispensar","POST",{
      bordadoId: order.bordadoId,
      nomeArquivo: b.fileName || "",
      motivo: motivo,
      executor: meuNome,
    });
    if (r && r.success && r.executados) setExecutados(r.executados);
    return r;
  };
  const dispensarBordado = async (b) => {
    if (!order.bordadoId) return;
    const motivo = prompt(
      "Motivo pra dispensar a programação desse bordado?\n\n" +
      "Ex.: \"Bordado igual ao 08.01.0119 já programado\", \"Cliente já tem arte anterior\", etc.\n\n" +
      "(Cancelar pra desistir)"
    );
    if (!motivo || !motivo.trim()) return;
    setDispensandoKey(b.fileName);
    try {
      const r = await dispensarComMotivo(b, motivo.trim());
      if (!r || !r.success) alert("Erro: "+((r&&r.error)||"desconhecido"));
    } catch(e) { alert("Erro: "+e.message); }
    setDispensandoKey(null);
  };
  // Retomar: desfaz a dispensa (ou a execução) — remove o registro de executado
  // pra o bordado voltar a precisar de programação.
  const [retomandoKey, setRetomandoKey] = useState(null);
  const retomarBordado = async (b) => {
    if (!order.bordadoId) return;
    if (!confirm("Retomar a programação deste bordado? Ele volta a precisar ser programado.")) return;
    setRetomandoKey(b.fileName);
    try {
      const r = await apiFetch("/programacao-reverter","POST",{
        bordadoId: order.bordadoId,
        nomeArquivo: b.fileName || "",
      });
      if (r.success) setExecutados(r.executados || []);
      else alert("Erro: "+(r.error||"desconhecido"));
    } catch(e) { alert("Erro: "+e.message); }
    setRetomandoKey(null);
  };                                   // legado: sem termo → todos
  // REGRA CRÍTICA: se não temos bordado real pra programar/amostrar, NUNCA
  // criamos item fictício ("Programação geral"). Pra a Programação isso é
  // sensível — programadora é terceirizada e o que ela anexar vira cobrança.
  // Estados possíveis:
  //  - loadingDet && bordados vazio → mostra "Carregando bordados..."
  //  - !loadingDet && bordados vazio → mostra alerta "Nenhum bordado pra ..."
  //  - bordados existem → renderiza normal
  // NOTA: a guarda "sem bordados" NÃO pode ficar aqui — abaixo ainda há hooks
  // (useState/useEffect/useRef). Um return condicional antes deles muda a
  // contagem de hooks entre renders (vazio → enriquecido) e quebra com o
  // React #300. Por isso ela foi movida pra logo antes do return principal,
  // depois de TODOS os hooks.
  const TITULOS={"Programação":"PROGRAMAÇÃO DE BORDADO","Amostra Digital":"ENVIAR AMOSTRA DIGITAL","Amostra Física":"CONFIRMAR AMOSTRA FÍSICA"};
  const HINTS={"Programação":"Para cada bordado: baixe a referência, informe a dificuldade e anexe o(s) arquivo(s) programado(s).","Amostra Digital":"Para cada bordado: baixe a referência e anexe a(s) imagem(ns) da amostra digital.","Amostra Física":"Para cada bordado: baixe a referência e anexe a(s) foto(s) da amostra física."};
  // Programação: aceita QUALQUER formato (a programadora pode anexar .emb, .dst,
  // .pes, .jef, imagens etc). Se restringir por accept, o dialog do navegador
  // trata como "arquivos personalizados" e esconde os outros — a operadora pode
  // não achar o arquivo que quer. Amostras: só imagens (é o que a operação
  // sempre anexa nessa etapa).
  const ACCEPT=comDificuldade?"":"image/*";
  // Amostra Digital agora é responsável por anexar o EMB de programação (campo
  // adicional, além da amostra digital). O EMB aceita qualquer formato.
  const temEmb=etapa==="Amostra Digital";
  const BTN=comDificuldade?"Confirmar programação":etapa==="Amostra Digital"?"Enviar amostra digital":"Confirmar amostra";
  const motivoRej=etapa==="Amostra Digital"?order.motivoRejAmDigital:etapa==="Amostra Física"?order.motivoRejAmFisica:"";
  // Key estável baseada em fileName (existe no snapshot leve E no enriched).
  // Antes usava fileId — mas fileId só chega no enriched (~1s depois),
  // então keys mudavam entre snapshot leve e completo, e o data indexado ficava órfão.
  const keyOf=(b,i)=>(b.fileName || b.fileId || ("idx"+i));

  // Storage key por bordadoId — persiste rascunho entre fecha/abre o card
  const STORAGE_KEY = `sgp-prog-rascunho-${order.bordadoId || order.posvendaId || "sem-id"}`;

  const [data,setData]=useState(()=>{
    // Tenta recuperar rascunho salvo (só dificuldade — files não persistem)
    let saved={};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) || {};
    } catch {}
    const m={};
    bordados.forEach((b,i)=>{
      const k=keyOf(b,i);
      m[k]={
        difs: (Array.isArray(saved[k]?.difs) && saved[k].difs.length) ? saved[k].difs : (saved[k]?.dificuldade ? [saved[k].dificuldade] : [""]),
        files: [], // File objects não podem ser serializados
        _tinhaFilesAntes: !!(saved[k]?.filesNomes?.length),
        _filesNomesAntes: saved[k]?.filesNomes || [],
      };
    });
    return m;
  });
  // Quando os bordados mudam (enriquecimento sob demanda chega ~1s depois), garante
  // que data tem uma entrada pra cada bordado — senão st = data[k] vira undefined
  // e quebra ao acessar .dificuldade
  useEffect(()=>{
    setData(prev=>{
      const novo={...prev};
      let mudou=false;
      bordados.forEach((b,i)=>{
        const k=keyOf(b,i);
        if(!novo[k]){novo[k]={dificuldade:"",files:[]};mudou=true;}
      });
      return mudou?novo:prev;
    });
  },[bordados.length]);
  const [enviando,setEnviando]=useState(false);
  // Refs estáveis dos inputs file (um por bordado). Evita bugs onde
  // getElementById pega input desmontado depois de re-render.
  const inputsRef = useRef({});
  const embInputsRef = useRef({});
  // Reporta pra o OrderModal quantos arquivos estão anexados mas não enviados
  useEffect(()=>{
    if (!setTemPendencias) return;
    const total = Object.values(data).reduce((s,v)=>s+(v?.files?.length||0),0);
    setTemPendencias(total);
    return () => { setTemPendencias(0); };
  },[data]);

  // Persiste em sessionStorage: dificuldade + NOMES dos arquivos anexados
  // (arquivos em si não persistem — precisam ser re-anexados. Mas os nomes
  // ficam registrados pra mostrar aviso "você anexou X.pdf antes, re-anexe")
  useEffect(()=>{
    try {
      const persist = {};
      for (const [k,v] of Object.entries(data)) {
        persist[k] = {
          difs: Array.isArray(v?.difs) ? v.difs : (v?.dificuldade ? [v.dificuldade] : []),
          filesNomes: (v?.files || []).map(f => f.name),
        };
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {}
  },[data]);
  const ehImagem=(n="")=>/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(n);
  const nomeLimpo=(n="")=>n.replace(/\s*~(PROG|AMOSTRA)/gi,"").trim()||n;
  // Dificuldade agora é uma LISTA (uma por programação). A programadora define
  // quantas programações o arquivo exigiu e a dificuldade de cada uma.
  const getDifs=(k)=>{ const d=data[k]?.difs; return (Array.isArray(d)&&d.length)?d:[""]; };
  const setNumProg=(k,n)=>setData(p=>{ const cur=(p[k]?.difs&&p[k].difs.length)?[...p[k].difs]:[""]; const nn=Math.max(1,Math.min(20,n)); while(cur.length<nn)cur.push(""); cur.length=nn; return {...p,[k]:{...(p[k]||{}),difs:cur,files:p[k]?.files||[]}}; });
  const setDifAt=(k,idx,d)=>setData(p=>{ const cur=(p[k]?.difs&&p[k].difs.length)?[...p[k].difs]:[""]; cur[idx]=d; return {...p,[k]:{...(p[k]||{}),difs:cur,files:p[k]?.files||[]}}; });
  // Compat/bulk: define 1 programação com a dificuldade d.
  const setDif=(k,d)=>setData(p=>({...p,[k]:{...(p[k]||{}),difs:[d],files:p[k]?.files||[]}}));
  const addFiles=(k,fl)=>setData(p=>({...p,[k]:{...(p[k]||{}),dificuldade:p[k]?.dificuldade||"",files:[...(p[k]?.files||[]),...Array.from(fl)]}}));
  const rmFile=(k,idx)=>setData(p=>({...p,[k]:{...(p[k]||{}),dificuldade:p[k]?.dificuldade||"",files:(p[k]?.files||[]).filter((_,i)=>i!==idx)}}));
  // EMB de programação (Amostra Digital) — arquivos separados dos da amostra.
  const addEmbFiles=(k,fl)=>setData(p=>({...p,[k]:{...(p[k]||{}),embFiles:[...(p[k]?.embFiles||[]),...Array.from(fl)]}}));
  const rmEmbFile=(k,idx)=>setData(p=>({...p,[k]:{...(p[k]||{}),embFiles:(p[k]?.embFiles||[]).filter((_,i)=>i!==idx)}}));
  const DIFS=[["Fácil",C.green],["Médio",C.amber],["Difícil",C.red]];

  const confirmar=async()=>{
    // Se etapa é Programação com sistema de "assumir": só valida/envia os que EU assumi
    const bordadosPraExecutar = ehProgAssumivel
      ? bordados.filter(b => {
          // Já executado OU dispensado → não entra na validação nem no envio.
          // (Corrige o erro "Defina a dificuldade" em bordado já dispensado.)
          if (findExecutado(b.fileName || "")) return false;
          const a = findAssumido(b.fileName || "");
          return a && String(a.userId) === meuId;
        })
      : bordados;
    if (ehProgAssumivel && !bordadosPraExecutar.length) {
      // Caso especial: TODOS os bordados já foram executados (por qualquer um da
      // equipe), mas o pedido não avançou de etapa. Aí não faz sentido exigir
      // "assumir" — não sobrou nada pra executar. Só falta avançar a etapa.
      const faltamExecutar = bordados.filter(b => !findExecutado(b.fileName || ""));
      if (bordados.length > 0 && faltamExecutar.length === 0) {
        setEnviando(true);
        try {
          const m = await onAction(order.id, "avancar_programacao", {});
          try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
          setActionMsg(m || "Etapa avançada."); setActionDone(true);
        } catch (e) { alert("Erro ao avançar: " + e.message); }
        finally { setEnviando(false); }
        return;
      }
      alert("Você não assumiu nenhum bordado. Clique em 'Assumir esta programação' primeiro.");
      return;
    }
    for(const b of bordadosPraExecutar){
      const i=bordados.indexOf(b);
      const st=data[keyOf(b,i)]||{dificuldade:"",files:[]};
      if(comDificuldade){ const difs=getDifs(keyOf(b,i)); if(!difs.length||difs.some(d=>!d)){alert(`Defina a dificuldade das ${difs.length} programação(ões) do bordado: ${nomeLimpo(b.fileName)}`);return;} }
      // Programação não anexa mais arquivo (o EMB é responsabilidade da Amostra
      // Digital). Só as amostras exigem o anexo principal.
      if(!comDificuldade&&!st.files.length){alert(`Anexe ao menos um arquivo para: ${nomeLimpo(b.fileName)}`);return;}
    }
    setEnviando(true);
    try{
      const toB64=(f)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
      // ── ANEXO ÚNICO PARA VÁRIOS BORDADOS ────────────────────────────────
      // "Anexar 1 arquivo aos selecionados" colocava o MESMO arquivo em cada
      // bordado. Num pedido com 17 bordados o payload ia com 17 cópias do
      // base64 (dezenas de MB) e o worker fazia 17 uploads — estourava os 45s
      // e dava "O servidor demorou demais para responder".
      // Agora cada arquivo vai UMA vez em `anexos` e as execuções só apontam
      // pra ele por {ref}. O worker resolve a referência e sobe uma vez só.
      const anexos={};
      const refDe=async(f)=>{
        const chave=`${f.name}|${f.size}|${f.lastModified||0}`;
        if(!anexos[chave]) anexos[chave]={fileName:f.name,fileBase64:await toB64(f)};
        return {ref:chave,fileName:f.name};
      };
      const execucoes=[];
      for(const b of bordadosPraExecutar){
        const i=bordados.indexOf(b);
        const st=data[keyOf(b,i)]||{dificuldade:"",files:[]};
        const arquivos=[];
        for(const f of st.files) arquivos.push(await refDe(f));
        // Amostra Digital: EMB de programação (campo adicional) → propriedadeEmb
        const arquivosEmb=[];
        if(temEmb) for(const f of (st.embFiles||[])) arquivosEmb.push(await refDe(f));
        const difsB=comDificuldade?getDifs(keyOf(b,i)).filter(Boolean):[];
        execucoes.push({nomeArquivo:nomeLimpo(b.fileName),fileId:b.fileId?String(b.fileId):"",position:(b.position||b.positionLabel)?String(b.position||b.positionLabel):"",dificuldade:comDificuldade?(difsB[0]||""):"",numProgramacoes:comDificuldade?difsB.length:0,dificuldades:difsB,arquivos,arquivosEmb});
      }
      const m=await onAction(order.id,"exec_bordado",{execucoes,anexos,propriedadeEmb:temEmb?"programacao_de_bordado":""});
      // Registra quem executou cada bordado (só na Programação assumível)
      if(ehProgAssumivel&&order.bordadoId){
        try{
          await apiFetch("/programacao-registrar-execucao","POST",{
            bordadoId: order.bordadoId,
            execucoes: bordadosPraExecutar.map(b=>({
              fileName: b.fileName||"",
              userId: meuId,
              userName: meuNome,
            })),
          });
        }catch(e){ /* registro é bônus */ }
      }
      // Sucesso: limpa rascunho do sessionStorage
      try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
      setActionMsg(m||"Registrado.");setActionDone(true);
    }catch(e){alert("Erro ao enviar: "+e.message);}
    finally{setEnviando(false);}
  };

  // ── AÇÕES EM MASSA (tabela de execução da Programação) ───────────────────
  const chavesSelecionaveis = () => bordados
    .map((b,i)=>({b,i,k:keyOf(b,i)}))
    .filter(({b})=>{
      // não deixa selecionar bordado assumido por OUTRA pessoa
      const a = ehProgAssumivel ? findAssumido(b.fileName||"") : null;
      return !(a && String(a.userId)!==meuId);
    });
  const toggleSel = (k)=>setSelKeys(prev=>{const n=new Set(prev);n.has(k)?n.delete(k):n.add(k);return n;});
  const selAllToggle = ()=>{
    const todas = chavesSelecionaveis().map(x=>x.k);
    const todasMarcadas = todas.length>0 && todas.every(k=>selKeys.has(k));
    setSelKeys(todasMarcadas?new Set():new Set(todas));
  };
  const bordadosSelecionados = ()=>bordados.filter((b,i)=>selKeys.has(keyOf(b,i)));
  // ── AMOSTRA: anexar UM arquivo a VÁRIOS bordados selecionados de uma vez ──────
  const bulkAmostraRef = useRef(null);
  const aplicarArquivoAmostra = (files)=>{
    const alvos = bordadosSelecionados().filter(b=>!(ehProgAssumivel&&findExecutado(b.fileName||"")));
    if(!alvos.length){ alert("Marque ao menos um bordado para anexar."); return; }
    if(!files||!files.length) return;
    alvos.forEach(b=>{ const i=bordados.indexOf(b); addFiles(keyOf(b,i), files); });
  };
  const bulkAssumir = async ()=>{
    const alvos = bordadosSelecionados().filter(b=>{
      if(findExecutado(b.fileName||"")) return false;
      const a=findAssumido(b.fileName||"");
      return !(a && String(a.userId)===meuId);
    });
    if(!alvos.length){alert("Nada para assumir nos selecionados.");return;}
    setBulkBusy("assumir");
    for(const b of alvos){ try{ await assumirBordado(b); }catch(e){} }
    setBulkBusy("");
  };
  const bulkDispensar = async ()=>{
    const alvos = bordadosSelecionados().filter(b=>!findExecutado(b.fileName||""));
    if(!alvos.length){alert("Nada para dispensar nos selecionados.");return;}
    const motivo = prompt(`Motivo para dispensar a programação dos ${alvos.length} bordado(s) selecionado(s)?\n\nO MESMO motivo vale para todos.\n\n(Cancelar para desistir)`);
    if(!motivo||!motivo.trim())return;
    setBulkBusy("dispensar");
    for(const b of alvos){ try{ await dispensarComMotivo(b, motivo.trim()); }catch(e){} }
    setBulkBusy(""); setSelKeys(new Set());
  };
  const bulkSetDif = (d)=>{
    bordadosSelecionados().filter(b=>!findExecutado(b.fileName||""))
      .forEach(b=>{ const i=bordados.indexOf(b); setDif(keyOf(b,i), d); });
  };
  const bulkExecutar = async ()=>{
    const alvos = bordadosSelecionados().filter(b=>{
      if(findExecutado(b.fileName||"")) return false;
      const a=findAssumido(b.fileName||"");
      if(!a || String(a.userId)!==meuId) return false;
      const difs=getDifs(keyOf(b,bordados.indexOf(b)));
      return difs.length>0 && difs.every(Boolean);
    });
    if(!alvos.length){alert("Nenhum selecionado pronto para executar. Precisa estar assumido por você e com a dificuldade de cada programação definida.");return;}
    setBulkBusy("executar");
    try{
      const execucoes = alvos.map(b=>{
        const i=bordados.indexOf(b); const difsB=getDifs(keyOf(b,i)).filter(Boolean);
        return {nomeArquivo:nomeLimpo(b.fileName),fileId:b.fileId?String(b.fileId):"",position:(b.position||b.positionLabel)?String(b.position||b.positionLabel):"",dificuldade:difsB[0]||"",numProgramacoes:difsB.length,dificuldades:difsB,arquivos:[],arquivosEmb:[]};
      });
      const m = await onAction(order.id,"exec_bordado",{execucoes});
      try{ sessionStorage.removeItem(STORAGE_KEY); }catch{}
      setActionMsg(m||"Registrado."); setActionDone(true);
    }catch(e){ alert("Erro ao executar: "+e.message); }
    setBulkBusy(""); setSelKeys(new Set());
  };

  // Guarda "sem bordados" — agora DEPOIS de todos os hooks (early return seguro).
  if(!bordados.length){
    const carregando = loadingDet===true;
    return (
      <div style={{padding:"32px 24px",background:carregando?C.gray50:"#fff8f1",border:`1.5px solid ${carregando?C.gray200:C.amber+"55"}`,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",gap:12,textAlign:"center"}}>
        {carregando ? (
          <>
            <Ic n="spin" s={22} c={C.gray500}/>
            <div style={{...F.title,fontSize:14,fontWeight:700,color:C.gray600}}>Carregando bordados...</div>
            <div style={{...F.body,fontSize:12,color:C.gray500,maxWidth:420}}>
              Aguarde enquanto buscamos os arquivos anexados ao pedido.
            </div>
          </>
        ) : (
          <>
            <Ic n="warn" s={22} c={C.amber}/>
            <div style={{...F.title,fontSize:14,fontWeight:700,color:"#92400e"}}>
              {comDificuldade ? "Nenhum bordado pra programar" : "Nenhum bordado pra amostrar"}
            </div>
            <div style={{...F.body,fontSize:12,color:"#92400e",maxWidth:460,lineHeight:1.55}}>
              Este pedido está na etapa <strong>{etapa}</strong>, mas não tem nenhum arquivo/bordado anexado que precise dessa ação.
              <br/><br/>
              Verifique com o <strong>vendedor</strong> se o pedido está no fluxo correto. Nenhuma execução pode ser feita sem arquivo referência.
            </div>
          </>
        )}
      </div>
    );
  }
  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      {previewExec&&<FileLightbox file={previewExec} onClose={()=>setPreviewExec(null)}/>}
      {/* Arquivos de referência das etapas anteriores — a bordadeira/operadora
          precisa ter todos os anexos aprovados pra executar corretamente. */}
      {etapa!=="Programação"&&(() => {
        const progIds = String(order.arqProgramacao||"").split(";").filter(Boolean);
        const digIds = String(order.arqAmostraDigital||"").split(";").filter(Boolean);
        const fisIds = String(order.arqAmostraFisica||"").split(";").filter(Boolean);
        const mostrarDig = etapa==="Amostra Física" || etapa==="Aprovação de Amostra Física"
                        || etapa==="Bordado Interno" || etapa==="Bordado Externo";
        const mostrarFis = etapa==="Bordado Interno" || etapa==="Bordado Externo";
        if (!progIds.length && !(mostrarDig&&digIds.length) && !(mostrarFis&&fisIds.length)) return null;
        return (
          <div style={{display:"flex",flexDirection:"column",gap:12,background:"#faf5ff",border:`1.5px solid #a78bfa55`,borderRadius:10,padding:14}}>
            <div style={{...F.title,fontSize:12,fontWeight:800,color:"#6b21a8",letterSpacing:"0.05em",textTransform:"uppercase"}}>
              📎 Arquivos das etapas anteriores
            </div>
            {progIds.length>0&&<div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>
                Arquivos da programação ({progIds.length})
              </label>
              <ArquivosBox fileIds={progIds} emptyText=""/>
            </div>}
            {mostrarDig&&digIds.length>0&&<div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>
                Amostra digital aprovada ({digIds.length})
              </label>
              <ArquivosBox fileIds={digIds} emptyText=""/>
            </div>}
            {mostrarFis&&fisIds.length>0&&<div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>
                Amostra física aprovada ({fisIds.length})
              </label>
              <ArquivosBox fileIds={fisIds} emptyText=""/>
            </div>}
          </div>
        );
      })()}
      <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
        <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>{TITULOS[etapa]||"EXECUÇÃO"}</div>
        <div style={{...F.body,fontSize:13,color:C.gray600}}>{HINTS[etapa]||"Anexe o(s) arquivo(s) de cada bordado."}</div>
      </div>
      {order.reprogramacao&&<div style={{background:"#f97316"+"12",border:`1.5px solid #f97316`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:30,height:30,borderRadius:7,background:"#f97316",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...F.title,fontSize:16,color:C.white}}>↻</div>
        <div style={{flex:1}}>
          <div style={{...F.title,fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:"0.06em"}}>REPROGRAMAÇÃO</div>
          <div style={{...F.body,fontSize:12,color:"#9a3412",marginTop:1}}>Este item foi reprovado e voltou para esta etapa. Anexe o novo arquivo.</div>
          {motivoRej&&<div style={{marginTop:8,padding:"8px 10px",background:C.white,borderRadius:6,border:"1px solid #fed7aa"}}>
            <div style={{...F.body,fontSize:10,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo da reprovação</div>
            <div style={{...F.body,fontSize:13,color:"#7c2d12"}}>{motivoRej}</div>
          </div>}
        </div>
      </div>}
      {/* Banner de arquivos pendentes - só aparece se tem anexos ainda não enviados */}
      {(() => {
        const totalPendente = Object.values(data).reduce((s,v)=>s+(v?.files?.length||0),0);
        if (totalPendente === 0) return null;
        // Pra programação multi-bordado: mostra quantos bordados ainda faltam depois
        const totalBord = bordados.length;
        const executadosCount = ehProgAssumivel ? bordados.filter(b => findExecutado(b.fileName || "")).length : 0;
        const restantesDepois = ehProgAssumivel ? totalBord - executadosCount - Object.keys(data).filter(k => (data[k]?.files?.length||0) > 0).length : 0;
        return (
          <div style={{background:"#fef3c7",border:`1.5px solid ${C.amber}`,borderLeft:`5px solid ${C.amber}`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
            <span style={{fontSize:22,lineHeight:1}}>⚠️</span>
            <div style={{flex:1}}>
              <div style={{...F.title,fontSize:12,fontWeight:700,color:"#92400e",letterSpacing:"0.06em",textTransform:"uppercase"}}>Anexos ainda NÃO enviados</div>
              <div style={{...F.body,fontSize:13,color:"#78350f",marginTop:4,lineHeight:1.5}}>
                Você tem <strong>{totalPendente} arquivo{totalPendente!==1?"s":""}</strong> anexado{totalPendente!==1?"s":""} localmente. Se fechar sem clicar em <strong>"{BTN}"</strong>, os anexos serão perdidos e você vai precisar anexar de novo.
                {ehProgAssumivel && restantesDepois > 0 && <>
                  <br/><br/>
                  <span style={{background:"#fff",border:"1.5px solid #f59e0b",borderRadius:6,padding:"6px 10px",display:"inline-block",marginTop:4}}>
                    ℹ️ <strong>Ao clicar em "{BTN}"</strong>, seu arquivo será salvo no HubSpot e o pedido <strong>continuará em Programação</strong>. Ainda faltam <strong>{restantesDepois} bordado{restantesDepois!==1?"s":""}</strong> pra outros programadores executarem antes de avançar pra Amostra Digital.
                  </span>
                </>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Contador de progresso — quantos bordados já executados vs total */}
      {ehProgAssumivel && bordados.length > 1 && (() => {
        const totalBord = bordados.length;
        const executadosCount = bordados.filter(b => findExecutado(b.fileName || "")).length;
        const pct = totalBord ? Math.round((executadosCount / totalBord) * 100) : 0;
        return (
          <div style={{background:C.white,border:`1.5px solid ${executadosCount===totalBord?C.green:C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Progresso do pedido</div>
              <div style={{...F.body,fontSize:12,fontWeight:700,color:executadosCount===totalBord?C.green:C.gray700}}>
                {executadosCount} de {totalBord} bordado{totalBord!==1?"s":""} executado{executadosCount!==1?"s":""}
              </div>
            </div>
            <div style={{height:6,background:C.gray100,borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",background:executadosCount===totalBord?C.green:C.blue,transition:"width 0.3s"}}/>
            </div>
            {executadosCount < totalBord && <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:6}}>
              O pedido só avança quando <strong>todos os bordados</strong> tiverem arquivo anexado.
            </div>}
          </div>
        );
      })()}
      {/* NOVA TABELA DE EXECUÇÃO (Programação) — seleção múltipla + ações em massa */}
      {ehProgAssumivel && (() => {
        const selCount = selKeys.size;
        const selavel = chavesSelecionaveis();
        const todasMarcadas = selavel.length>0 && selavel.every(x=>selKeys.has(x.k));
        const gcols = "36px 56px 1fr 168px 168px";
        return (
          <div>
            {/* Barra de ações em massa */}
            <div style={{position:"sticky",top:0,zIndex:3,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:"10px 10px 0 0",padding:"10px 14px",display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}>
              <label style={{display:"flex",alignItems:"center",gap:7,...F.body,fontSize:13,fontWeight:600,color:C.gray700,cursor:"pointer"}}>
                <input type="checkbox" checked={todasMarcadas} onChange={selAllToggle} style={{width:16,height:16,accentColor:C.red,cursor:"pointer"}}/> Selecionar todos
              </label>
              <span style={{background:selCount?C.red:C.gray100,color:selCount?"#fff":C.gray600,borderRadius:20,padding:"3px 11px",...F.body,fontSize:12,fontWeight:700}}>{selCount} selecionado{selCount!==1?"s":""}</span>
              <div style={{flex:1}}/>
              <div style={{display:"flex",alignItems:"center",gap:5,...F.body,fontSize:11.5,color:C.gray500}}>
                Dificuldade:
                {DIFS.map(([d,cor])=>(
                  <button key={d} onClick={()=>bulkSetDif(d)} disabled={!selCount} style={{border:`1.5px solid ${C.gray200}`,background:"#fff",color:cor,borderRadius:6,padding:"5px 10px",...F.body,fontSize:11.5,fontWeight:700,cursor:selCount?"pointer":"not-allowed",opacity:selCount?1:.5}}>{d}</button>
                ))}
              </div>
              <button onClick={bulkAssumir} disabled={!selCount||!!bulkBusy} style={{background:(!selCount||bulkBusy)?"#ccc":C.blue,color:"#fff",border:"none",borderRadius:7,padding:"8px 13px",...F.body,fontSize:12.5,fontWeight:700,cursor:(!selCount||bulkBusy)?"not-allowed":"pointer",whiteSpace:"nowrap"}}>{bulkBusy==="assumir"?"...":"▲ Assumir"}</button>
              <button onClick={bulkDispensar} disabled={!selCount||!!bulkBusy} style={{background:"#fef3c7",color:"#92400e",border:`1.5px solid ${C.amber}`,borderRadius:7,padding:"7px 12px",...F.body,fontSize:12.5,fontWeight:700,cursor:(!selCount||bulkBusy)?"not-allowed":"pointer",whiteSpace:"nowrap",opacity:(!selCount||bulkBusy)?.5:1}}>{bulkBusy==="dispensar"?"...":"⊘ Dispensar"}</button>
              <button onClick={bulkExecutar} disabled={!selCount||!!bulkBusy} style={{background:(!selCount||bulkBusy)?"#ccc":C.red,color:"#fff",border:"none",borderRadius:7,padding:"8px 13px",...F.body,fontSize:12.5,fontWeight:700,cursor:(!selCount||bulkBusy)?"not-allowed":"pointer",whiteSpace:"nowrap"}}>{bulkBusy==="executar"?"...":"✔ Executar"}</button>
            </div>
            {/* Cabeçalho */}
            <div style={{display:"grid",gridTemplateColumns:gcols,gap:10,alignItems:"center",padding:"9px 14px",borderLeft:`1px solid ${C.gray200}`,borderRight:`1px solid ${C.gray200}`,background:C.gray50,...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              <div/><div>Foto</div><div>Bordado</div><div>Status / Dificuldade</div><div style={{textAlign:"right"}}>Ações</div>
            </div>
            {/* Linhas */}
            {bordados.map((b,i)=>{
              const k=keyOf(b,i); const st=data[k]||{dificuldade:""}; const img=ehImagem(b.fileName||"");
              const assumido=findAssumido(b.fileName||""); const executado=findExecutado(b.fileName||"");
              const ehMeu=assumido && String(assumido.userId)===meuId;
              const jaExecutado=!!executado; const disp=jaExecutado&&executado.dispensado;
              const bloqueado=assumido&&!ehMeu;
              const isSel=selKeys.has(k);
              return (
                <div key={k} style={{display:"grid",gridTemplateColumns:gcols,gap:10,alignItems:"center",padding:"10px 14px",borderLeft:`1px solid ${C.gray200}`,borderRight:`1px solid ${C.gray200}`,borderBottom:`1px solid ${C.gray100}`,background:isSel?"#fdf3f3":disp?"#fffbeb":jaExecutado?"#f0fdf4":bloqueado?C.gray50:"#fff",opacity:bloqueado?0.65:1}}>
                  <div>{!bloqueado&&<input type="checkbox" checked={isSel} onChange={()=>toggleSel(k)} style={{width:16,height:16,accentColor:C.red,cursor:"pointer"}}/>}</div>
                  <div onClick={b.fileUrl?()=>setPreviewExec({url:b.fileUrl,nome:b.fileName}):undefined}
                    title={b.fileUrl?"Pré-visualizar":undefined}
                    style={{position:"relative",width:52,height:52,borderRadius:8,border:`1px solid ${C.gray200}`,background:C.gray100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:b.fileUrl?"pointer":"default"}}>
                    {img&&b.fileUrl?<img src={b.fileUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Ic n="box" s={20} c={C.gray400}/>}
                    {b.fileUrl&&<span style={{position:"absolute",bottom:2,right:2,background:"rgba(0,0,0,0.6)",borderRadius:4,padding:"1px 3px",display:"inline-flex"}}><Ic n="search" s={10} c={C.white}/></span>}
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{...F.body,fontSize:12.5,fontWeight:700,color:C.gray800,wordBreak:"break-word"}}>{nomeLimpo(b.fileName)}</div>
                    <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2,lineHeight:1.5}}>
                      <RenderCombos b={b}/>
                    </div>
                    {b.fileUrl&&<button onClick={()=>setPreviewExec({url:b.fileUrl,nome:b.fileName})} style={{...F.body,fontSize:11,color:C.blue,fontWeight:600,background:"none",border:"none",padding:0,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,marginTop:3}}><Ic n="search" s={12} c={C.blue}/> Pré-visualizar referência</button>}
                    {disp&&executado.motivo&&<div style={{...F.body,fontSize:11,color:"#92400e",fontStyle:"italic",marginTop:2}}>💬 {executado.motivo}</div>}
                  </div>
                  <div>
                    {jaExecutado
                      ? <span style={{...F.body,fontSize:11,fontWeight:700,color:disp?"#92400e":"#15803d"}}>{disp?"⊘ Dispensado":"✔ Executado"}{executado.executor?" · "+executado.executor:""}</span>
                      : bloqueado
                        ? <span style={{...F.body,fontSize:11,color:C.gray500}}>🔒 Com {assumido.userName||"outro"}</span>
                        : <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{...F.body,fontSize:10,color:C.gray500,fontWeight:600}}>Nº progr.:</span>
                              <button onClick={()=>setNumProg(k,getDifs(k).length-1)} disabled={getDifs(k).length<=1} style={{border:`1.5px solid ${C.gray300}`,background:"#fff",color:C.gray600,borderRadius:5,width:22,height:22,cursor:getDifs(k).length<=1?"not-allowed":"pointer",fontWeight:800,lineHeight:1,opacity:getDifs(k).length<=1?0.4:1}}>−</button>
                              <span style={{...F.title,fontSize:13,fontWeight:800,minWidth:14,textAlign:"center"}}>{getDifs(k).length}</span>
                              <button onClick={()=>setNumProg(k,getDifs(k).length+1)} style={{border:`1.5px solid ${C.gray300}`,background:"#fff",color:C.gray600,borderRadius:5,width:22,height:22,cursor:"pointer",fontWeight:800,lineHeight:1}}>+</button>
                            </div>
                            {getDifs(k).map((dv,di)=>(
                              <div key={di} style={{display:"flex",gap:4,alignItems:"center"}}>
                                {getDifs(k).length>1&&<span style={{...F.body,fontSize:10,color:C.gray400,width:16,fontWeight:700}}>{di+1}ª</span>}
                                {DIFS.map(([d,cor])=>(
                                  <button key={d} onClick={()=>setDifAt(k,di,d)} style={{border:`1.5px solid ${dv===d?cor:C.gray200}`,background:dv===d?cor+"14":"#fff",color:dv===d?cor:C.gray500,borderRadius:6,padding:"4px 8px",...F.body,fontSize:11,fontWeight:700,cursor:"pointer"}}>{d}</button>
                                ))}
                              </div>
                            ))}
                          </div>}
                  </div>
                  <div style={{display:"flex",gap:5,justifyContent:"flex-end",flexWrap:"wrap"}}>
                    {jaExecutado
                      ? <button onClick={()=>retomarBordado(b)} disabled={retomandoKey===b.fileName} style={{border:`1.5px solid ${C.amber}`,background:"#fffbeb",color:"#92400e",borderRadius:6,padding:"5px 9px",...F.body,fontSize:11,fontWeight:700,cursor:"pointer"}}>{retomandoKey===b.fileName?"...":"↩ Retomar"}</button>
                      : bloqueado ? <span style={{...F.body,fontSize:11,color:C.gray400}}>—</span>
                      : ehMeu
                        ? <><button onClick={()=>dispensarBordado(b)} disabled={dispensandoKey===b.fileName} style={{border:`1.5px solid ${C.amber}`,background:"#fffbeb",color:"#92400e",borderRadius:6,padding:"5px 9px",...F.body,fontSize:11,fontWeight:600,cursor:"pointer"}}>⊘</button><button onClick={()=>liberarBordado(b)} style={{border:`1.5px solid ${C.gray300}`,background:"#fff",color:C.gray600,borderRadius:6,padding:"5px 9px",...F.body,fontSize:11,cursor:"pointer"}}>Liberar</button></>
                        : <><button onClick={()=>assumirBordado(b)} style={{border:`1.5px solid ${C.blue}`,background:"#fff",color:C.blue,borderRadius:6,padding:"5px 9px",...F.body,fontSize:11,fontWeight:700,cursor:"pointer"}}>▲ Assumir</button><button onClick={()=>dispensarBordado(b)} style={{border:`1.5px solid ${C.amber}`,background:"#fffbeb",color:"#92400e",borderRadius:6,padding:"5px 9px",...F.body,fontSize:11,fontWeight:600,cursor:"pointer"}}>⊘</button></>}
                  </div>
                </div>
              );
            })}
            <div style={{border:`1px solid ${C.gray200}`,borderTop:"none",borderRadius:"0 0 10px 10px",height:8}}/>
          </div>
        );
      })()}
      {/* AMOSTRA: barra de seleção múltipla + anexar 1 arquivo a todos selecionados */}
      {!comDificuldade && bordados.length>0 && (()=>{
        const selavel = chavesSelecionaveis();
        const todasMarcadas = selavel.length>0 && selavel.every(x=>selKeys.has(x.k));
        const nSel = selKeys.size;
        return (
          <div style={{position:"sticky",top:0,zIndex:3,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <label style={{display:"flex",alignItems:"center",gap:7,...F.body,fontSize:13,fontWeight:600,color:C.gray700,cursor:"pointer"}}>
              <input type="checkbox" checked={todasMarcadas} onChange={selAllToggle} style={{width:16,height:16,accentColor:C.red,cursor:"pointer"}}/> Selecionar todos
            </label>
            <span style={{...F.body,fontSize:12,color:C.gray500}}>{nSel} selecionado{nSel!==1?"s":""}</span>
            <div style={{flex:1,minWidth:8}}/>
            <input type="file" multiple accept={ACCEPT} ref={bulkAmostraRef} style={{display:"none"}}
              onChange={e=>{ const fl=e.target.files; if(fl&&fl.length) aplicarArquivoAmostra(fl); setTimeout(()=>{if(e.target)e.target.value="";},0); }}/>
            <button type="button" disabled={nSel===0}
              onClick={()=>{ if(nSel===0){alert("Marque ao menos um bordado.");return;} bulkAmostraRef.current&&bulkAmostraRef.current.click(); }}
              style={{padding:"9px 14px",borderRadius:7,border:"none",background:nSel===0?C.gray300:C.red,color:C.white,cursor:nSel===0?"not-allowed":"pointer",...F.body,fontSize:13,fontWeight:700,display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
              <Ic n="box" s={14} c={C.white}/> Anexar 1 arquivo aos selecionados
            </button>
          </div>
        );
      })()}
      {!ehProgAssumivel && bordados.map((b,i)=>{
        const k=keyOf(b,i);const st=data[k]||{dificuldade:"",files:[]};const img=ehImagem(b.fileName||"");
        // Arquivos gerais de programação (todos os fileIds gravados). Usado como
        // fallback quando o registro do executado não tem fileIds específicos
        // (execuções antigas antes do tracking por-bordado).
        const progIds = String(order.arqProgramacao||"").split(";").filter(Boolean);
        const obsProgr = b.obs_programacao || "";
        const obsBord  = b.obs_bordado || "";
        const mostrarObsProgr = !!obsProgr;
        const mostrarObsBord  = etapa!=="Programação" && !!obsBord;
        // Status de assumido/executado (só Programação)
        const assumido = ehProgAssumivel ? findAssumido(b.fileName||"") : null;
        const executado = ehProgAssumivel ? findExecutado(b.fileName||"") : null;
        const ehMeu = assumido && String(assumido.userId) === meuId;
        const bloqueado = ehProgAssumivel && assumido && !ehMeu;
        // Pra Programação: só habilita anexar/dificuldade DEPOIS de assumir.
        // Se ninguém assumiu ainda, esconde os controls e força "Assumir tarefa".
        const precisaAssumir = ehProgAssumivel && !assumido && !executado;
        const jaExecutado = ehProgAssumivel && !!executado;
        return(
          <div key={k} style={{
            border:jaExecutado?`2px solid ${C.green}`:bloqueado?`1.5px solid ${C.gray300}`:ehMeu?`2px solid ${C.blue}`:`1px solid ${C.gray200}`,
            borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:12,
            background:jaExecutado?C.green+"08":bloqueado?C.gray50:C.white,
            opacity:bloqueado?0.75:1,
          }}>
            {/* Amostra: checkbox de seleção (pra anexar 1 arquivo a vários) */}
            {!comDificuldade && !jaExecutado && <label style={{display:"flex",alignItems:"center",gap:8,...F.body,fontSize:12,fontWeight:600,color:selKeys.has(k)?C.red:C.gray600,cursor:"pointer"}}>
              <input type="checkbox" checked={selKeys.has(k)} onChange={()=>toggleSel(k)} style={{width:16,height:16,accentColor:C.red,cursor:"pointer"}}/> Selecionar este bordado
            </label>}
            {/* Badge de já executado */}
            {jaExecutado&&<div style={{background:executado.dispensado?"#fef3c7":C.green+"14",border:`1.5px solid ${executado.dispensado?C.amber+"66":C.green+"55"}`,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div style={{...F.body,fontSize:12,fontWeight:700,color:executado.dispensado?"#92400e":"#065f46",display:"flex",alignItems:"center",gap:6}}>
                {executado.dispensado ? <span style={{fontSize:14}}>⊘</span> : <Ic n="check" s={14} c={C.green}/>}
                {executado.dispensado
                  ? <>Dispensado por <strong>{executado.executor||"—"}</strong></>
                  : <>Já executado por <strong>{executado.executor||"—"}</strong></>}
                {executado.executadoEm && <span style={{color:C.gray500,fontWeight:500,fontSize:11}}>
                  {" · " + new Date(executado.executadoEm).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
                </span>}
              </div>
              {executado.dispensado
                ? <button onClick={()=>retomarBordado(b)} disabled={retomandoKey===b.fileName}
                    style={{background:C.white,border:`1.5px solid ${C.amber}`,color:"#92400e",borderRadius:6,padding:"5px 12px",cursor:retomandoKey===b.fileName?"wait":"pointer",...F.body,fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>
                    {retomandoKey===b.fileName ? "..." : "↩ Retomar programação"}
                  </button>
                : <span style={{...F.body,fontSize:11,color:C.gray500}}>Você pode substituir se necessário</span>}
            </div>}
            {/* Motivo da dispensa (se houver) */}
            {jaExecutado && executado.dispensado && executado.motivo && <div style={{background:C.white,border:`1px dashed ${C.amber+"55"}`,borderRadius:6,padding:"6px 10px",...F.body,fontSize:12,color:C.gray700,fontStyle:"italic"}}>
              💬 {executado.motivo}
            </div>}
            {/* Arquivo(s) que foram anexados no executado
                Se tem fileIds específicos, usa eles (novo tracking v2.9.83+).
                Senão, cai no fallback dos arquivos gerais de programação
                (execuções antigas). */}
            {(() => {
              if (!jaExecutado || executado.dispensado) return null;
              const ids = (executado.fileIds && executado.fileIds.length) ? executado.fileIds : progIds;
              if (!ids.length) return null;
              const usandoFallback = !(executado.fileIds && executado.fileIds.length);
              return (
                <div>
                  <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>
                    Arquivo{ids.length!==1?"s":""} programado{ids.length!==1?"s":""}
                    {usandoFallback && <span style={{color:C.gray400,fontWeight:500,textTransform:"none",letterSpacing:0,fontSize:10,marginLeft:6}}>· todos do pedido</span>}
                  </div>
                  <ArquivosBox fileIds={ids} emptyText=""/>
                </div>
              );
            })()}
            {/* Badge de assumido — só na Programação */}
            {ehProgAssumivel&&assumido&&<div style={{
              background:ehMeu?C.blue+"12":C.gray100,
              border:`1.5px solid ${ehMeu?C.blue:C.gray300}`,
              borderRadius:6,padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10
            }}>
              <div style={{...F.body,fontSize:12,fontWeight:700,color:ehMeu?C.blue:C.gray700,display:"flex",alignItems:"center",gap:6}}>
                <Ic n="check" s={14} c={ehMeu?C.blue:C.gray700}/>
                {ehMeu ? "✓ Você assumiu esta programação" : `🔒 Assumida por ${assumido.userName}`}
              </div>
              {ehMeu&&<button onClick={()=>liberarBordado(b)} style={{background:"none",border:"none",color:C.gray500,cursor:"pointer",...F.body,fontSize:11,textDecoration:"underline"}}>Liberar</button>}
            </div>}
            {/* Botão assumir se ninguém assumiu E não foi executado ainda */}
            {ehProgAssumivel&&!assumido&&!jaExecutado&&<button
              onClick={()=>assumirBordado(b)}
              disabled={assumindoKey===b.fileName}
              style={{background:C.blue,color:C.white,border:"none",borderRadius:6,padding:"9px 14px",cursor:assumindoKey===b.fileName?"wait":"pointer",...F.body,fontSize:13,fontWeight:700,alignSelf:"flex-start"}}>
              {assumindoKey===b.fileName ? "Assumindo..." : "▲ Assumir esta programação"}
            </button>}
            {/* Aviso quando precisa assumir antes de anexar */}
            {precisaAssumir && <div style={{background:C.blue+"0e",border:`1.5px solid ${C.blue}30`,borderLeft:`4px solid ${C.blue}`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"flex-start",gap:8}}>
              <span style={{fontSize:16,lineHeight:1}}>ℹ️</span>
              <div style={{...F.body,fontSize:12,color:C.gray700,lineHeight:1.4}}>
                Assuma a programação antes de anexar arquivos. Isso evita que outra pessoa da equipe execute o mesmo bordado.
              </div>
            </div>}
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {img&&b.fileUrl
                ?<img src={b.fileUrl} alt="" style={{width:64,height:64,objectFit:"cover",borderRadius:8,border:`1px solid ${C.gray200}`,flexShrink:0}}/>
                :<div style={{width:64,height:64,borderRadius:8,background:C.gray100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="box" s={24} c={C.gray400}/></div>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,wordBreak:"break-word"}}>{nomeLimpo(b.fileName)}</div>
                <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:3,fontWeight:600,lineHeight:1.5}}>
                  <RenderCombos b={b}/>
                </div>
                {b.fileUrl&&<a href={b.fileUrl} target="_blank" rel="noreferrer" download style={{...F.body,fontSize:12,color:C.blue,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,marginTop:4,textDecoration:"none"}}><Ic n="download" s={13} c={C.blue}/> Baixar referência</a>}
              </div>
            </div>
            {mostrarObsProgr && (
              <div style={{background:"#fef3c7",border:`2px solid ${C.amber}`,borderLeft:`6px solid ${C.amber}`,borderRadius:8,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{fontSize:22,lineHeight:1,flexShrink:0}}>📋</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{...F.title,fontSize:11,fontWeight:700,color:"#92400e",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Observação para a Programação</div>
                  <div style={{...F.body,fontSize:14,color:"#78350f",fontWeight:600,lineHeight:1.45,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{obsProgr}</div>
                </div>
              </div>
            )}
            {mostrarObsBord && (
              <div style={{background:"#ede9fe",border:`2px solid ${C.purple}`,borderLeft:`6px solid ${C.purple}`,borderRadius:8,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{fontSize:22,lineHeight:1,flexShrink:0}}>🧵</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{...F.title,fontSize:11,fontWeight:700,color:"#5b21b6",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Observação para o Bordado</div>
                  <div style={{...F.body,fontSize:14,color:"#4c1d95",fontWeight:600,lineHeight:1.45,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{obsBord}</div>
                </div>
              </div>
            )}
            {!bloqueado && !precisaAssumir && !jaExecutado && comDificuldade&&<div>
              <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Dificuldade</div>
              <div style={{display:"flex",gap:8}}>
                {DIFS.map(([d,cor])=>(
                  <button key={d} onClick={()=>setDif(k,d)}
                    style={{flex:1,padding:"9px 12px",borderRadius:7,border:`1.5px solid ${st.dificuldade===d?cor:C.gray200}`,background:st.dificuldade===d?cor+"14":C.white,color:st.dificuldade===d?cor:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:700}}>{d}</button>
                ))}
              </div>
            </div>}
            {!bloqueado && !precisaAssumir && !jaExecutado && <div>
              {/* Programação NÃO anexa mais arquivo — só define dificuldade e
                  (opcionalmente) dispensa. O anexo (EMB) migrou pra Amostra
                  Digital. Amostras continuam anexando o arquivo principal. */}
              {!comDificuldade && <>
                <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Arquivo(s) da amostra</div>
                <input type="file" multiple accept={ACCEPT}
                  ref={el => { if (el) inputsRef.current[k] = el; }}
                  style={{display:"none"}}
                  onChange={e=>{
                    const files = e.target.files;
                    if (files && files.length) addFiles(k, files);
                    setTimeout(() => { if (e.target) e.target.value = ""; }, 0);
                  }}/>
                <button type="button"
                  onClick={()=>{ const el = inputsRef.current[k]; if (el) el.click(); }}
                  style={{padding:"9px 14px",borderRadius:7,border:`1.5px dashed ${C.gray300}`,background:C.gray50,color:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none"}}>
                  <Ic n="box" s={14} c={C.gray500}/> Anexar arquivo
                </button>
                {st.files.length>0&&<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
                  {st.files.map((f,idx)=>(
                    <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,background:C.green+"0e",border:`1px solid ${C.green}30`,borderRadius:6,padding:"7px 10px"}}>
                      <span style={{...F.body,fontSize:12,color:C.gray700,wordBreak:"break-all",display:"inline-flex",alignItems:"center",gap:6}}><Ic n="check" s={12} c={C.green}/> {f.name}</span>
                      <button onClick={()=>rmFile(k,idx)} style={{background:"none",border:"none",cursor:"pointer",color:C.gray400,fontSize:15,lineHeight:1,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>}
              </>}
              {/* Dispensar — só na Programação (arquivo dispensável não registra). */}
              {ehProgAssumivel && ehMeu && !jaExecutado && <button type="button"
                onClick={()=>dispensarBordado(b)}
                disabled={dispensandoKey===b.fileName}
                style={{padding:"9px 14px",borderRadius:7,border:`1.5px solid ${C.amber}`,background:"#fef3c7",color:"#92400e",cursor:dispensandoKey===b.fileName?"wait":"pointer",...F.body,fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none"}}>
                <span style={{fontSize:14}}>⊘</span> {dispensandoKey===b.fileName ? "Dispensando..." : "Não precisa programar"}
              </button>}
              {/* EMB de programação — só na Amostra Digital (campo adicional). */}
              {temEmb && <div style={{marginTop:14,paddingTop:14,borderTop:`1px dashed ${C.gray200}`}}>
                <div style={{...F.body,fontSize:11,fontWeight:700,color:"#6b21a8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>🧵 Programação (EMB) <span style={{color:C.gray400,fontWeight:500,textTransform:"none",letterSpacing:0}}>· opcional</span></div>
                <input type="file" multiple accept=""
                  ref={el => { if (el) embInputsRef.current[k] = el; }}
                  style={{display:"none"}}
                  onChange={e=>{
                    const files = e.target.files;
                    if (files && files.length) addEmbFiles(k, files);
                    setTimeout(() => { if (e.target) e.target.value = ""; }, 0);
                  }}/>
                <button type="button"
                  onClick={()=>{ const el = embInputsRef.current[k]; if (el) el.click(); }}
                  style={{padding:"9px 14px",borderRadius:7,border:`1.5px dashed #a78bfa`,background:"#faf5ff",color:"#6b21a8",cursor:"pointer",...F.body,fontSize:13,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none"}}>
                  <Ic n="box" s={14} c="#7c3aed"/> Anexar EMB de programação
                </button>
                {(st.embFiles||[]).length>0&&<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
                  {st.embFiles.map((f,idx)=>(
                    <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,background:"#f3e8ff",border:`1px solid #a78bfa55`,borderRadius:6,padding:"7px 10px"}}>
                      <span style={{...F.body,fontSize:12,color:"#6b21a8",wordBreak:"break-all",display:"inline-flex",alignItems:"center",gap:6}}><Ic n="check" s={12} c="#7c3aed"/> {f.name}</span>
                      <button onClick={()=>rmEmbFile(k,idx)} style={{background:"none",border:"none",cursor:"pointer",color:C.gray400,fontSize:15,lineHeight:1,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>}
              </div>}
            </div>}
          </div>
        );
      })}
      <button onClick={confirmar} disabled={enviando}
        style={{background:enviando?"#ccc":C.red,color:C.white,border:"none",borderRadius:7,padding:"11px 24px",cursor:enviando?"not-allowed":"pointer",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
        <Ic n="send" s={15} c={C.white}/> {enviando?"Enviando...":BTN}
      </button>
    </div>
  );
}


// ─── BIPAGEM DA EXPEDIÇÃO ─────────────────────────────────────────────────────
// Segunda conferência: o expedidor bipa todas as peças; a contagem por
// produto+grade tem que bater com o pedido. Cadeado (senha) libera conferência
// manual por produto caso o leitor falhe.
function BipagemExpedicao({order,onChange,user}){
  const linhas=[];
  const idx={};
  (order.items||[]).forEach(it=>{
    const produto=String(it.sku||"").trim(), grade=String(it.cor||"").trim();
    const key=produto+"|"+grade;
    if(idx[key]==null){ idx[key]=linhas.length; linhas.push({key,produto,grade,desc:it.desc||"",qty:0}); }
    linhas[idx[key]].qty+=Number(it.qty||0);
  });
  const lineKeys=new Set(linhas.map(l=>l.key));

  const [scans,setScans]=useState([]);
  const [resolvidos,setResolvidos]=useState({});
  const [desconhecidos,setDesconhecidos]=useState({});
  const [manual,setManual]=useState({});
  const [unlocked,setUnlocked]=useState(false);
  const [input,setInput]=useState("");
  const [showSenha,setShowSenha]=useState(false);
  const [senha,setSenha]=useState("");
  const [senhaErro,setSenhaErro]=useState("");
  const inputRef=useRef(null);
  const pendingRef=useRef(new Set());
  const timerRef=useRef(null);

  useEffect(()=>{ if(inputRef.current) inputRef.current.focus(); },[]);

  const resolverPendentes=async()=>{
    const lote=Array.from(pendingRef.current); pendingRef.current=new Set();
    if(!lote.length) return;
    try{
      const r=await apiFetch("/codigos/lookup","POST",{codigos:lote});
      if(r.success){
        if(r.mapa) setResolvidos(prev=>({...prev,...r.mapa}));
        if(r.desconhecidos&&r.desconhecidos.length) setDesconhecidos(prev=>{const n={...prev};r.desconhecidos.forEach(c=>n[c]=true);return n;});
      }
    }catch(e){/* recomputa quando resolver */}
  };
  const onScan=(code)=>{
    const c=String(code).trim(); if(!c) return;
    setScans(prev=>[...prev,c]);
    if(!resolvidos[c]&&!desconhecidos[c]){
      pendingRef.current.add(c);
      if(timerRef.current) clearTimeout(timerRef.current);
      timerRef.current=setTimeout(resolverPendentes,250);
    }
    setInput("");
    if(inputRef.current) inputRef.current.focus();
  };

  const bipMap={}; let naoPert=0;
  scans.forEach(c=>{
    const r=resolvidos[c];
    if(!r) return;
    const key=String(r.produto).trim()+"|"+String(r.grade).trim();
    if(lineKeys.has(key)) bipMap[key]=(bipMap[key]||0)+1; else naoPert++;
  });
  const conferido=(l)=>{ const mv=manual[l.key]; if(unlocked&&mv!=null&&mv!=="") return Number(mv)||0; return bipMap[l.key]||0; };
  const okLinha=(l)=>conferido(l)===l.qty;
  const totalPedido=linhas.reduce((s,l)=>s+l.qty,0);
  const totalConferido=linhas.reduce((s,l)=>s+conferido(l),0);
  const desconhecidosList=Object.keys(desconhecidos);
  const houveManual=unlocked&&Object.values(manual).some(v=>v!=null&&v!=="");
  const ready=linhas.length>0&&linhas.every(okLinha);

  useEffect(()=>{
    if(!onChange) return;
    onChange(ready,{
      totalPedido,totalConferido,bateu:ready,desbloqueado:houveManual,
      detalhes:{linhas:linhas.map(l=>({produto:l.produto,grade:l.grade,esperado:l.qty,bipado:bipMap[l.key]||0,manual:(unlocked&&manual[l.key]!=null&&manual[l.key]!=="")?Number(manual[l.key]):null})),desconhecidos:desconhecidosList,naoPertence:naoPert},
    });
  // eslint-disable-next-line
  },[ready,totalConferido,totalPedido,houveManual,desconhecidosList.length,naoPert]);

  const validarSenha=async()=>{
    setSenhaErro("");
    try{
      const r=await apiFetch("/expedicao/validar-senha","POST",{senha});
      if(r.naoConfigurada){ setSenhaErro("Nenhuma senha definida. Configure na aba Configurar SLA."); return; }
      if(r.ok){ setUnlocked(true); setShowSenha(false); setSenha(""); }
      else setSenhaErro("Senha incorreta.");
    }catch(e){ setSenhaErro(e.message); }
  };
  const limpar=()=>{ setScans([]); setResolvidos({}); setDesconhecidos({}); setManual({}); if(inputRef.current) inputRef.current.focus(); };

  return(
    <div style={{border:`1.5px solid ${ready?C.green:C.gray200}`,borderRadius:10,padding:16,background:ready?C.green+"08":C.white,position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:8}}>
        <div style={{...F.title,fontSize:12,fontWeight:700,color:C.gray600,letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:7}}>
          <Ic n="barcode" s={16} c={ready?C.green:C.gray500}/> CONFERÊNCIA POR BIPAGEM
        </div>
        <button onClick={()=>{ if(unlocked) return; setShowSenha(s=>!s); setSenhaErro(""); }} title={unlocked?"Conferência manual liberada":"Desbloquear conferência manual"}
          style={{background:"transparent",border:"none",cursor:unlocked?"default":"pointer",display:"flex",alignItems:"center",gap:4,color:unlocked?C.amber:C.gray300,padding:4}}>
          <Ic n="lock" s={15} c={unlocked?C.amber:C.gray300}/>
          {unlocked&&<span style={{...F.body,fontSize:10,fontWeight:700,color:C.amber}}>manual</span>}
        </button>
      </div>

      {showSenha&&!unlocked&&(
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 12px",background:C.amber+"0e",border:`1px solid ${C.amber}40`,borderRadius:7,flexWrap:"wrap"}}>
          <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")validarSenha();}} placeholder="Senha do gestor"
            style={{border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"7px 10px",...F.body,fontSize:13,outline:"none",width:160}}/>
          <button onClick={validarSenha} style={{background:C.amber,color:C.white,border:"none",borderRadius:6,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:12,...F.body}}>Liberar</button>
          {senhaErro&&<span style={{...F.body,fontSize:12,color:C.red}}>{senhaErro}</span>}
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();onScan(input);}}}
          placeholder="Bipe os códigos aqui (um por peça)…"
          style={{flex:1,minWidth:220,border:`1.5px solid ${C.gray300}`,borderRadius:7,padding:"11px 13px",...F.body,fontSize:14,outline:"none",fontFamily:"monospace"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8,...F.body,fontSize:13}}>
          <span style={{fontWeight:700,color:ready?C.green:(totalConferido>totalPedido?C.red:C.gray700)}}>{totalConferido} / {totalPedido} peças</span>
          <button onClick={limpar} style={{background:C.white,color:C.gray500,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:12,...F.body}}>Limpar</button>
        </div>
      </div>

      <div style={{overflowX:"auto",border:`1px solid ${C.gray200}`,borderRadius:8}}>
        <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:420}}>
          <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
            {["Produto","Grade","Esperado","Conferido","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:11,color:C.gray500,fontWeight:700,...F.body,textTransform:"uppercase"}}>{h}</th>)}
          </tr></thead>
          <tbody>{linhas.map(l=>{
            const conf=conferido(l), ok=conf===l.qty;
            return(
              <tr key={l.key} style={{borderBottom:`1px solid ${C.gray100}`,background:ok?C.green+"08":(conf>l.qty?C.red+"08":"transparent")}}>
                <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700}}>{l.produto}</td>
                <td style={{padding:"7px 10px",...F.body,color:C.gray600}}>{l.grade||"—"}</td>
                <td style={{padding:"7px 10px",fontWeight:700,...F.body}}>{l.qty}</td>
                <td style={{padding:"7px 10px",...F.body}}>
                  {unlocked
                    ?<input type="number" min="0" value={manual[l.key]!=null?manual[l.key]:(bipMap[l.key]||0)} onChange={e=>setManual(p=>({...p,[l.key]:e.target.value}))}
                       style={{width:64,border:`1.5px solid ${C.amber}`,borderRadius:5,padding:"4px 7px",...F.body,fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/>
                    :<span style={{fontWeight:700,color:ok?C.green:(conf>l.qty?C.red:C.gray700)}}>{conf}</span>}
                </td>
                <td style={{padding:"7px 10px"}}>
                  {ok?<span style={{...F.body,fontSize:12,fontWeight:700,color:C.green,display:"inline-flex",alignItems:"center",gap:4}}><Ic n="check" s={13} c={C.green}/>OK</span>
                    :conf>l.qty?<span style={{...F.body,fontSize:12,fontWeight:700,color:C.red}}>Excesso</span>
                    :<span style={{...F.body,fontSize:12,color:C.gray400}}>Faltam {l.qty-conf}</span>}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {desconhecidosList.length>0&&(
        <div style={{marginTop:10,padding:"9px 12px",background:C.red+"0e",border:`1px solid ${C.red}33`,borderRadius:7,...F.body,fontSize:12,color:C.red}}>
          <strong>Código(s) não cadastrado(s):</strong> {desconhecidosList.join(", ")}. Solicite o cadastro ao gestor (aba Códigos de Barra) ou libere a conferência manual no cadeado.
        </div>
      )}
      {naoPert>0&&(
        <div style={{marginTop:10,padding:"9px 12px",background:C.amber+"12",border:`1px solid ${C.amber}40`,borderRadius:7,...F.body,fontSize:12,color:"#8a5a00"}}>
          {naoPert} peça(s) bipada(s) <strong>não pertencem a este pedido</strong> (produto/grade fora da lista).
        </div>
      )}
      {ready&&<div style={{marginTop:10,...F.body,fontSize:13,fontWeight:700,color:C.green,display:"flex",alignItems:"center",gap:6}}><Ic n="check" s={15} c={C.green}/>Conferência completa{houveManual?" (com ajuste manual)":""} — pode avançar.</div>}
    </div>
  );
}

// ─── ABA DE EXECUÇÃO POR PERFIL ──────────────────────────────────────────────
// ─── AÇÃO: RETIRAR E CONFERIR ─────────────────────────────────────────────────
// Sub-componente pra encapsular os hooks (useState) que antes ficavam dentro
// de um `if` do AcaoTab — o que quebrava as regras dos Hooks do React (#300).
// Observação do pedido, destacada. Traz instrução de produção ("fazer um tamanho
// acima da XG", "cliente não recebe nos últimos dias do mês") que quem executa a
// etapa precisa ler ANTES de agir — não vale exigir que troque de aba.
function ObsDoPedido({order}){
  const txt=[order.obs,order.dadosAdicionais].filter(x=>String(x||"").trim()).join("\n");
  if(!txt.trim())return null;
  return(
    <div style={{background:"#fffbeb",border:"1.5px solid #f59e0b55",borderRadius:8,padding:"12px 14px"}}>
      <div style={{...F.body,fontSize:10,color:"#92400e",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
        <Ic n="warn" s={12} c="#92400e"/> Observações do pedido
      </div>
      <div style={{...F.body,fontSize:13.5,color:"#3a2a08",lineHeight:1.55,whiteSpace:"pre-wrap",fontWeight:600}}>{txt}</div>
    </div>
  );
}

// Lista compacta dos itens do pedido, pra conferir sem sair da aba Executar.
function ItensResumo({order,titulo="Itens do pedido"}){
  const itens=(order.items||[]).filter(it=>!it.naoSeparavel);
  if(!itens.length)return null;
  const total=itens.reduce((s,it)=>s+(Number(it.qty)||0),0);
  return(
    <div>
      <div style={{...F.body,fontSize:10,color:C.gray500,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>
        {titulo} — {itens.length} linha{itens.length!==1?"s":""} · {total} peça{total!==1?"s":""}
      </div>
      <div style={{border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",...F.body,fontSize:12.5}}>
          <thead><tr style={{background:C.gray50,borderBottom:`1px solid ${C.gray200}`}}>
            {["SKU","Descrição","Tam.","Qtd"].map((h,i)=>(
              <th key={h} style={{padding:"8px 10px",textAlign:i>=2?"center":"left",...F.body,fontSize:10,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{itens.map((it,i)=>(
            <tr key={it.id||i} style={{borderBottom:`1px solid ${C.gray100}`}}>
              <td style={{padding:"7px 10px",color:C.gray600,whiteSpace:"nowrap"}}>{it.sku||"—"}</td>
              <td style={{padding:"7px 10px",color:C.black}}>{it.desc||"—"}</td>
              <td style={{padding:"7px 10px",textAlign:"center",color:C.gray700,fontWeight:600}}>{it.cor||"—"}</td>
              <td style={{padding:"7px 10px",textAlign:"center",fontWeight:700}}>{it.qty}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// Criação de OP Sob Medida: a responsável abre a OP no sistema de produção e
// registra o número aqui. Campo obrigatório — sem o número não dá pra rastrear
// a peça depois.
function CriarOPSobMedidaAcao({order, setActionMsg, setActionDone, onAction}){
  const [numeroOP,setNumeroOP]=useState(order.numeroOP||"");
  const [obs,setObs]=useState("");
  const [enviando,setEnviando]=useState(false);
  const enviar=async()=>{
    const op=String(numeroOP||"").trim();
    if(!op){alert("Informe o número da OP.");return;}
    setEnviando(true);
    try{
      const m=await onAction(order.id,"op_sob_medida",{numeroOP:op,obs:obs.trim()});
      setActionMsg(m||"");setActionDone(true);
    }catch(e){alert("Erro: "+e.message);}
    finally{setEnviando(false);}
  };
  const lbl={...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5};
  const inp={width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",...F.body,fontSize:14,outline:"none",boxSizing:"border-box"};
  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
        <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:8}}>CRIAÇÃO DE OP SOB MEDIDA</div>
        <div style={{...F.body,fontSize:13,color:C.gray600}}>
          Abra a ordem de produção no sistema e registre o número aqui. O pedido segue para <strong>Aguardando Produção Sob Medida</strong>.
        </div>
        <div style={{marginTop:10}}><PrazoSobMedida o={order}/></div>
      </div>
      {/* Observação do pedido em destaque: costuma trazer instrução de produção
          ("fazer um tamanho acima da XG"), que quem abre a OP precisa ler. */}
      <ObsDoPedido order={order}/>
      {(order.formularioSobMedida&&order.formularioSobMedida.length>0)&&<div>
        <div style={{...F.body,fontSize:10,color:"#92400e",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Formulário Sob Medida</div>
        <ArquivosBox fileIds={order.formularioSobMedida} emptyText="Nenhum formulário anexado."/>
      </div>}
      {/* Itens que vão para a OP — conferir sem trocar de aba */}
      <ItensResumo order={order} titulo="Itens para a OP"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
        <div>
          <label style={lbl}>Número da OP</label>
          <input value={numeroOP} onChange={e=>setNumeroOP(e.target.value)} placeholder="Ex: 12345"
            onKeyDown={e=>e.key==="Enter"&&enviar()} style={inp} autoFocus/>
        </div>
        <div>
          <label style={lbl}>Observação (opcional)</label>
          <input value={obs} onChange={e=>setObs(e.target.value)} placeholder="algo relevante da produção" style={inp}/>
        </div>
      </div>
      <button onClick={enviar} disabled={enviando||!String(numeroOP||"").trim()}
        style={{background:(enviando||!String(numeroOP||"").trim())?C.gray300:C.red,color:C.white,border:"none",borderRadius:8,padding:"13px 24px",...F.body,fontWeight:700,fontSize:14,cursor:enviando?"wait":(String(numeroOP||"").trim()?"pointer":"not-allowed"),display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,alignSelf:"flex-start"}}>
        <Ic n="check" s={16} c={C.white}/> {enviando?"Registrando...":"Registrar OP"}
      </button>
    </div>
  );
}

function RetirarConferirAcao({order, me, setActionMsg, setActionDone}){
  const itensSep = order.items.filter(i => !i.naoSeparavel);
  const totalPecas = itensSep.reduce((s,i)=>s+Number(i.qty||0),0);
  const totalSeparado = itensSep.reduce((s,i)=>s+Number(i.qtdSeparada||0),0);
  const [obsConf, setObsConf] = useState("");
  const [enviandoConf, setEnviandoConf] = useState(false);
  const concluirConferencia = async () => {
    if (!order.posvendaId) { alert("Pedido sem negócio de Pós-venda."); return; }
    setEnviandoConf(true);
    try {
      const r = await apiFetch("/concluir-conferencia/"+order.posvendaId, "POST", {
        obs: obsConf.trim(),
        ctx: { executor: me?.nome || "Usuário SGP" },
      });
      if (r.success) {
        setActionMsg(`Conferência concluída. Pedido movido para ${r.proximaEtapa}.`);
        setActionDone(true);
      } else {
        alert("Erro: " + (r.error||"desconhecido"));
      }
    } catch (e) { alert("Erro: "+e.message); }
    setEnviandoConf(false);
  };
  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
        <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:8}}>RETIRAR E CONFERIR</div>
        <div style={{...F.body,fontSize:13,color:C.gray600}}>
          Retire fisicamente o pedido da separação e confira todos os itens contra a folha impressa. Ao concluir, o pedido segue para <strong>{order.temBordado===false?"Expedição":"Direcionamento (bordado)"}</strong>.
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <div style={{background:"#059669"+"12",border:`1.5px solid #05966955`,borderRadius:8,padding:"12px 14px"}}>
          <div style={{...F.body,fontSize:10.5,fontWeight:700,color:"#065f46",textTransform:"uppercase"}}>Total do pedido</div>
          <div style={{...F.title,fontSize:22,fontWeight:800,color:"#065f46",lineHeight:1,marginTop:4}}>{totalPecas} peças</div>
        </div>
        <div style={{background:C.gray100,border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"12px 14px"}}>
          <div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase"}}>Já separado</div>
          <div style={{...F.title,fontSize:22,fontWeight:800,color:C.gray700,lineHeight:1,marginTop:4}}>{totalSeparado} peças</div>
        </div>
        {order.temBordado!==false&&<div style={{background:C.red+"12",border:`1.5px solid ${C.red}55`,borderRadius:8,padding:"12px 14px"}}>
          <div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.red,textTransform:"uppercase"}}>Tem bordado</div>
          <div style={{...F.title,fontSize:14,fontWeight:800,color:C.red,lineHeight:1.2,marginTop:4}}>Vai pro Direcionamento</div>
        </div>}
        {order.temBordado===false&&<div style={{background:C.teal+"12",border:`1.5px solid ${C.teal}55`,borderRadius:8,padding:"12px 14px"}}>
          <div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.teal,textTransform:"uppercase"}}>Sem bordado</div>
          <div style={{...F.title,fontSize:14,fontWeight:800,color:C.teal,lineHeight:1.2,marginTop:4}}>Vai pra Expedição</div>
        </div>}
      </div>
      <button onClick={()=>imprimirPedido(order.vendasId||order.posvendaId)} style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:6,padding:"9px 14px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body,alignSelf:"flex-start"}}>
        <Ic n="print" s={14} c={C.gray700}/> Reimprimir Folha de Processamento
      </button>
      <div>
        <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações da conferência (opcional)</label>
        <textarea value={obsConf} onChange={e=>setObsConf(e.target.value)} rows={3}
          placeholder="Ex: pedido conferido, tudo ok; item X estava com etiqueta trocada..."
          style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
      </div>
      <button onClick={concluirConferencia} disabled={enviandoConf}
        style={{background:enviandoConf?"#ccc":"#059669",color:"#fff",border:"none",borderRadius:7,padding:"12px 24px",cursor:enviandoConf?"wait":"pointer",...F.body,fontWeight:700,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
        <Ic n="check" s={16} c="#fff"/> {enviandoConf?"Confirmando...":"Conferência concluída — avançar"}
      </button>
    </div>
  );
}

// ── CAIXA DE ANEXO MÚLTIPLO ──────────────────────────────────────────────────
// Um único "slot" que aceita N arquivos: clique ou arraste várias vezes e a
// lista vai acumulando. O worker sobe todos e grava os fileIds separados por
// ";" na MESMA propriedade — formato que o SGP já lia como lista em todo lugar
// (ArquivosBox, snapshot, folha de impressão), então nada mais precisou mudar.
// Dedup por nome+tamanho pra o usuário não anexar o mesmo arquivo duas vezes.
function CaixaAnexos({files,setFiles,accept,inputId,textoVazio="Clique ou arraste os arquivos aqui",compacto=false}){
  const lista=files||[];
  const add=(fl)=>{
    const novos=Array.from(fl||[]).filter(Boolean);
    if(!novos.length)return;
    setFiles(prev=>{
      const mapa=new Map((prev||[]).map(f=>[f.name+"|"+f.size,f]));
      novos.forEach(f=>mapa.set(f.name+"|"+f.size,f));
      return [...mapa.values()];
    });
  };
  const tem=lista.length>0;
  return(
    <div>
      <div style={{border:`2px dashed ${tem?C.green:C.gray200}`,borderRadius:8,padding:compacto?"20px":"28px 20px",textAlign:"center",background:tem?C.green+"06":C.gray50,cursor:"pointer",transition:"all 0.2s"}}
        onClick={()=>document.getElementById(inputId)?.click()}
        onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.red;}}
        onDragLeave={e=>e.currentTarget.style.borderColor=tem?C.green:C.gray200}
        onDrop={e=>{e.preventDefault();add(e.dataTransfer.files);e.currentTarget.style.borderColor=C.green;}}>
        <input id={inputId} type="file" multiple accept={accept||undefined} style={{display:"none"}}
          onChange={e=>{add(e.target.files);e.target.value="";}}/>
        {!compacto&&<Ic n="download" s={26} c={C.gray300} style={{margin:"0 auto 8px",display:"block"}}/>}
        <div style={{...F.body,fontSize:13,color:tem?C.green:C.gray500,fontWeight:tem?700:400}}>
          {tem?"+ Adicionar mais arquivos":textoVazio}
        </div>
        {accept&&<div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>Formatos aceitos: {accept}</div>}
      </div>
      {tem&&<div style={{display:"flex",flexDirection:"column",gap:6,marginTop:10}}>
        {lista.map((f,i)=>(
          <div key={f.name+"|"+f.size+"|"+i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:C.green+"0a",border:`1px solid ${C.green}40`,borderRadius:6}}>
            <Ic n="check" s={14} c={C.green}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...F.body,fontWeight:700,fontSize:13,color:C.gray700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
              <div style={{...F.body,fontSize:11,color:C.gray500}}>{(f.size/1024).toFixed(0)} KB</div>
            </div>
            <button title="Remover deste envio"
              onClick={e=>{e.stopPropagation();setFiles(prev=>prev.filter((_,j)=>j!==i));}}
              style={{background:"none",border:"none",color:C.red,cursor:"pointer",...F.body,fontSize:18,fontWeight:700,lineHeight:1,padding:"0 6px"}}>×</button>
          </div>
        ))}
        <div style={{...F.body,fontSize:11,color:C.gray500}}>
          {lista.length} arquivo{lista.length>1?"s":""} será{lista.length>1?"ão":""} enviado{lista.length>1?"s":""} neste slot.
        </div>
      </div>}
    </div>
  );
}
// Converte um File em base64 puro (sem o prefixo data:).
const arquivoParaBase64=(f)=>new Promise((res,rej)=>{
  const r=new FileReader();
  r.onload=()=>res(String(r.result).split(",")[1]);
  r.onerror=rej;
  r.readAsDataURL(f);
});

function AcaoTab({order,me,uploadFiles,setUploadFiles,obsText,setObsText,actionDone,setActionDone,actionMsg,setActionMsg,itemSel,itemDest,nSel,allDestDefined,skus,itensDirecionaveis,toggleItemSel,selAllItems,setDestSel,setDestAll,setDestOne,onAction,isMobile,loadingDet,setTemPendencias}){
  const etapa=order.etapa;
  const[uploading,setUploading]=useState(false);
  const[bipReady,setBipReady]=useState(false);
  const bipInfoRef=useRef({});
  // Fornecedor externo por item (quando o destino é Externo). Igual à tela.
  const[bordadorSel,setBordadorSel]=useState({});
  const BORDADORES=[["bordadel","Bordadel"],["mg_bordados","MG Bordados"],["outros","Outros"]];
  // Seleção de bordados p/ anexar a amostra física aprovada (default: todos).
  // Guarda só os DESmarcados; selecionado = valor !== false.
  const[selBordFis,setSelBordFis]=useState({});
  // Controle do executor: "colocado na máquina pra bordar" (por pedido).
  const[colocadoLocal,setColocadoLocal]=useState(order.colocadoParaBordar===true);
  const[colocandoBusy,setColocandoBusy]=useState(false);
  const toggleColocado=async()=>{
    setColocandoBusy(true);
    try{
      await apiFetch(`/colocar-para-bordar/${order.vendasId}`,"POST",{remover:colocadoLocal,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
      setColocadoLocal(v=>!v);
    }catch(e){alert("Erro: "+e.message);}
    finally{setColocandoBusy(false);}
  };

  // Pedido já concluído — apenas consulta, sem ação
  if(etapa==="Finalizado"){
    return(
      <div style={{padding:40,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:C.green+"14",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic n="check" s={26} c={C.green}/>
        </div>
        <div style={{...F.title,fontSize:18,fontWeight:700,color:C.green,textAlign:"center"}}>PEDIDO FINALIZADO</div>
        <div style={{...F.body,fontSize:13,color:C.gray500,textAlign:"center",maxWidth:380}}>Este pedido já foi concluído. Consulte o histórico completo nas abas SLA / Prazo e Timeline.</div>
      </div>
    );
  }

  // Ação já confirmada
  if(actionDone){
    const aguardando=actionMsg&&actionMsg.includes("Aguardando");
    return(
      <div style={{padding:40,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:(aguardando?C.amber:C.green)+"14",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic n={aguardando?"clock":"check"} s={26} c={aguardando?C.amber:C.green}/>
        </div>
        <div style={{...F.title,fontSize:18,fontWeight:700,color:aguardando?C.amber:C.green,textAlign:"center"}}>{aguardando?"LADO CONCLUÍDO":"AÇÃO CONFIRMADA"}</div>
        <div style={{...F.body,fontSize:13,color:C.gray500,textAlign:"center",maxWidth:380}}>{actionMsg||"O pedido foi movimentado com sucesso."}</div>
      </div>
    );
  }

  // ── EXECUÇÃO POR BORDADO: Programação (c/ dificuldade) e Amostra Digital ─
  if(etapa==="Programação"||etapa==="Amostra Digital"){
    return <ExecPorBordado order={order} etapa={etapa} comDificuldade={etapa==="Programação"} onAction={onAction} setActionMsg={setActionMsg} setActionDone={setActionDone} loadingDet={loadingDet} me={me} setTemPendencias={setTemPendencias}/>;
  }

  // ── AMOSTRA FÍSICA (executor) — só CONFIRMA que está pronta; NÃO anexa. ─────
  // Quem anexa a amostra aprovada é o VENDEDOR, na etapa de Aprovação.
  if(etapa==="Amostra Física"){
    const refIds=arquivosBordadoPorEtapa(order,"Amostra Física");
    const bords=order.bordadosJson||[];
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        {order.reprogramacao&&order.motivoRejAmFisica&&<div style={{background:"#f97316"+"12",border:`1.5px solid #f97316`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:"0.06em"}}>↻ REPROGRAMAÇÃO</div>
          <div style={{...F.body,fontSize:12,color:"#9a3412",marginTop:4}}>{order.motivoRejAmFisica}</div>
        </div>}
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>CONFIRMAR AMOSTRA FÍSICA</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>Confirme que a amostra física foi executada e está pronta. O vendedor vai anexar a amostra aprovada e aprovar.</div>
        </div>
        {bords.length>0&&<div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Bordados do pedido</label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {bords.map((b,i)=>(<div key={b.id||b.fileId||i} style={{...F.body,fontSize:12,color:C.gray700,padding:"7px 10px",background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6}}>{(b.sku?b.sku+" · ":"")}{b.positionLabel||b.productName||b.fileName||"Bordado"}</div>))}
          </div>
        </div>}
        {refIds.length>0&&<div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Arquivos do vendedor (referência)</label>
          <ArquivosBox fileIds={refIds}/>
        </div>}
        {/* Controle do executor: colocado na máquina (opcional, não muda etapa) */}
        <div style={{background:colocadoLocal?C.green+"0c":"#7c3aed08",border:`1px solid ${colocadoLocal?C.green+"55":"#7c3aed40"}`,borderRadius:8,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:180}}>
            <div style={{...F.body,fontSize:13,fontWeight:700,color:colocadoLocal?"#065f46":"#5b21b6"}}>{colocadoLocal?"🧵 Já está na máquina":"Colocar para bordar"}</div>
            <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>{colocadoLocal?"Marcado como em processo — não coloque de novo.":"Marque quando colocar na máquina, só pro seu controle."}</div>
          </div>
          <button onClick={toggleColocado} disabled={colocandoBusy}
            style={{border:colocadoLocal?`1.5px solid ${C.green}`:"none",background:colocadoLocal?C.white:"#7c3aed",color:colocadoLocal?"#065f46":C.white,borderRadius:7,padding:"9px 14px",...F.body,fontSize:12,fontWeight:700,cursor:colocandoBusy?"wait":"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:6}}>
            {colocadoLocal?<><Ic n="check" s={13} c="#065f46"/> Na máquina · desfazer</>:"🧵 Colocar para Bordar"}
          </button>
        </div>
        <button onClick={async()=>{try{const m=await onAction(order.id,"confirmar_amostra_fisica",{});setActionMsg(m||"");setActionDone(true);}catch(e){alert("Erro: "+e.message);}}}
          style={{background:"#be185d",color:C.white,border:"none",borderRadius:8,padding:"13px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,alignSelf:"flex-start",paddingLeft:24,paddingRight:24}}>
          <Ic n="check" s={16} c={C.white}/> Confirmar amostra física pronta
        </button>
      </div>
    );
  }

  // ── SOB MEDIDA ─────────────────────────────────────────────────────────────
  // (componente da criação de OP logo abaixo do bloco)
  // As duas etapas de sob medida não tinham aba Executar: a ação só existia no
  // botão da fila, então quem abria o pedido pra conferir o formulário ficava
  // sem como agir e tinha que fechar e voltar.
  if(etapa==="Criação de OP Sob Medida"){
    return <CriarOPSobMedidaAcao order={order} setActionMsg={setActionMsg} setActionDone={setActionDone} onAction={onAction}/>;
  }
  if(etapa==="Aguardando Produção Sob Medida"){
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:8}}>AGUARDANDO PRODUÇÃO SOB MEDIDA</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>
            {order.numeroOP
              ? <>Peça em produção pela <strong>OP {order.numeroOP}</strong>. Quando ficar pronta, confirme abaixo — o pedido segue para Conferência e Direcionamento.</>
              : <>Peça em produção. Quando ficar pronta, confirme abaixo — o pedido segue para Conferência e Direcionamento.</>}
          </div>
          <div style={{marginTop:10}}><PrazoSobMedida o={order}/></div>
        </div>
        <ObsDoPedido order={order}/>
        {(order.formularioSobMedida&&order.formularioSobMedida.length>0)&&<div>
          <div style={{...F.body,fontSize:10,color:"#92400e",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Formulário Sob Medida</div>
          <ArquivosBox fileIds={order.formularioSobMedida} emptyText="Nenhum formulário anexado."/>
        </div>}
        <ItensResumo order={order} titulo="Itens em produção"/>
        <button onClick={async()=>{
            if(!confirm("Confirmar que a produção da peça sob medida foi concluída?\n\nO pedido vai para Conferência e Direcionamento."))return;
            try{const m=await onAction(order.id,"producao_sm_concluida",{});setActionMsg(m||"");setActionDone(true);}
            catch(e){alert("Erro: "+e.message);}
          }}
          style={{background:C.green,color:C.white,border:"none",borderRadius:8,padding:"13px 24px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,alignSelf:"flex-start"}}>
          <Ic n="check" s={16} c={C.white}/> Produção concluída
        </button>
      </div>
    );
  }

  // ── RETIRAR E CONFERIR ─────────────────────────────────────────────────────
  // Etapa entre Separação e (Direcionamento OU Expedição). O conferente valida
  // o que foi separado. Ao concluir:
  //   - Com bordado → segue pra Direcionamento
  //   - Sem bordado → segue direto pra Expedição
  if(etapa==="Retirar e Conferir"){
    return <RetirarConferirAcao order={order} me={me} setActionMsg={setActionMsg} setActionDone={setActionDone}/>;
  }

  // ── DIRECIONADOR ────────────────────────────────────────────────────────────
  // Pedido SEM bordado em Conferência e Direcionamento: não há o que direcionar.
  // Só a ação "Conferido", que move o pedido para Expedição.
  if(etapa==="Conferência e Direcionamento" && order.temBordado===false){
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:8}}>CONFERÊNCIA E DIRECIONAMENTO</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>Pedido <strong>sem bordado</strong> — não há itens para direcionar. Confira o pedido e clique em <strong>Conferido</strong> para enviar à Expedição.</div>
        </div>
        <button onClick={()=>{onAction(order.id,"conferir_direcionamento",{});setActionDone(true);}}
          style={{alignSelf:"flex-start",background:C.green,color:C.white,border:"none",borderRadius:7,padding:"11px 22px",cursor:"pointer",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
          <Ic n="check" s={15} c={C.white}/> Conferido — enviar para Expedição
        </button>
      </div>
    );
  }
  // A etapa foi renomeada de "Direcionamento" → "Conferência e Direcionamento".
  // Mostra os controles de direcionar quando a amostra está aprovada / não é
  // necessária (order.amOk). Sem isso, o pedido caía no "Confirmar e avançar"
  // genérico e não aparecia o Interno/Externo.
  if(etapa==="Direcionamento" || (etapa==="Conferência e Direcionamento" && order.amOk)){
    const itensDir=itensDirecionaveis||order.items;
    const internos=itensDir.filter((it,i)=>itemDest[it.id||i]==="interno").length;
    const externos=itensDir.filter((it,i)=>itemDest[it.id||i]==="externo").length;
    const pendentes=itensDir.filter((it,i)=>!itemDest[it.id||i]).length;
    const ocultos=order.items.length-itensDir.length;
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:8}}>DIRECIONAR ITENS PARA BORDADO</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>Defina para cada SKU se o bordado será executado internamente ou por fornecedor externo.</div>
        </div>
        <div style={{background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
          <Ic n="box" s={14} c={C.blue}/>
          <div style={{...F.body,fontSize:12,color:C.blue,fontWeight:600}}>Exibindo apenas os <strong>{itensDir.length}</strong> item(ns) com bordado — somente estes precisam de direcionamento.{ocultos>0?` ${ocultos} item(ns) sem bordado ficam na aba "Todos os itens do pedido".`:""}</div>
        </div>

        {/* Barra de atalhos */}
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <input type="checkbox" checked={nSel===skus.length&&skus.length>0} onChange={selAllItems}
              style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
            <span style={{...F.body,fontSize:12,color:C.gray600,fontWeight:600}}>
              {nSel===0?"Selecionar todos":nSel===skus.length?"Todos selecionados":`${nSel} selecionado${nSel>1?"s":""}`}
            </span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setDestSel("interno")} style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
              <Ic n="arrow" s={12} c={C.white}/> Selecionados → Interno
            </button>
            <button onClick={()=>setDestSel("externo")} style={{background:C.purple,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
              <Ic n="box" s={12} c={C.white}/> Selecionados → Externo
            </button>
            <button onClick={()=>setDestAll("interno")} style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer"}}>Todos → Interno</button>
            <button onClick={()=>setDestAll("externo")} style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer"}}>Todos → Externo</button>
          </div>
        </div>

        {/* Tabela de itens */}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:420}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["","SKU","Descrição","TAM","Qtd","Destino"].map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",...F.body,fontSize:11,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{hd}</th>)}
            </tr></thead>
            <tbody>{itensDir.map((it,i)=>{
              const dest=itemDest[it.id||i];
              const sel=itemSel[it.id||i]||false;
              return(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`,background:sel?C.red+"06":"transparent"}}>
                  <td style={{padding:"9px 10px"}}>
                    <input type="checkbox" checked={sel} onChange={()=>toggleItemSel(it.id||i)}
                      style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
                  </td>
                  <td style={{padding:"9px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700}}>{it.sku}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray700}}>{it.desc}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray500,fontSize:12}}>{it.cor}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body}}>{it.qty}</td>
                  <td style={{padding:"9px 10px"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setDestOne(it.id||i,"interno")}
                          style={{background:dest==="interno"?C.green:C.white,color:dest==="interno"?C.white:C.gray700,border:`1.5px solid ${dest==="interno"?C.green:C.gray300}`,borderRadius:5,padding:"4px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:600}}>
                          Interno
                        </button>
                        <button onClick={()=>{setDestOne(it.id||i,"externo");setBordadorSel(p=>({...p,[it.id||i]:p[it.id||i]||"outros"}));}}
                          style={{background:dest==="externo"?C.purple:C.white,color:dest==="externo"?C.white:C.gray700,border:`1.5px solid ${dest==="externo"?C.purple:C.gray300}`,borderRadius:5,padding:"4px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:600}}>
                          Externo
                        </button>
                      </div>
                      {dest==="externo"&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {BORDADORES.map(([val,lbl])=>{
                          const on=(bordadorSel[it.id||i]||"outros")===val;
                          return <button key={val} onClick={()=>setBordadorSel(p=>({...p,[it.id||i]:val}))}
                            style={{background:on?C.purple+"18":C.white,color:on?C.purple:C.gray600,border:`1.5px solid ${on?C.purple:C.gray200}`,borderRadius:5,padding:"3px 9px",...F.body,fontSize:11,cursor:"pointer",fontWeight:on?700:500}}>{lbl}</button>;
                        })}
                      </div>}
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>

        {/* Resumo + confirmar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,paddingTop:8,borderTop:`1px solid ${C.gray200}`}}>
          <div style={{display:"flex",gap:16,...F.body,fontSize:13}}>
            <span>Interno: <strong style={{color:C.green}}>{internos}</strong></span>
            <span>Externo: <strong style={{color:C.purple}}>{externos}</strong></span>
            {pendentes>0&&<span style={{color:C.amber}}>Pendente: <strong>{pendentes}</strong></span>}
          </div>
          <button onClick={()=>{if(!allDestDefined){alert("Defina o destino de todos os itens.");return;}onAction(order.id,"direcionamento",{
              destinos: Object.fromEntries(
                itensDir.map((it,i)=>{
                  const key=it.id||it.sku;
                  const d=itemDest[it.id||i];
                  return [key, d==="interno" ? {dir:"Interno"} : {dir:"Externo",bordador:bordadorSel[it.id||i]||"outros"}];
                })
              )
            });setActionDone(true);}}
            disabled={!allDestDefined}
            style={{background:allDestDefined?C.green:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"10px 22px",cursor:allDestDefined?"pointer":"not-allowed",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
            <Ic n="check" s={14} c={C.white}/> Confirmar direcionamento
          </button>
        </div>
        {!allDestDefined&&<div style={{...F.body,fontSize:11,color:C.amber,display:"flex",alignItems:"center",gap:4}}>
          <Ic n="warn" s={11} c={C.amber}/> Defina o destino de todos os itens antes de confirmar.
        </div>}
      </div>
    );
  }

  // ── UPLOAD DE ARQUIVO (Programador, Amostra Digital, Amostra Física) ────────
  const UPLOAD_ETAPAS={
    "Programação":    {title:"Programação de Bordado",  btn:"Confirmar programação",   hint:"Anexe o arquivo .EMB ou similar com a programação de pontos.",  accept:".emb,.dst,.pes,.jef"},
    "Amostra Digital":{title:"Enviar Amostra Digital",  btn:"Enviar amostra digital",   hint:"Anexe a imagem da amostra digital para aprovação do pós-venda.", accept:"image/*"},
    "Amostra Física": {title:"Confirmar Amostra Física",btn:"Confirmar amostra pronta", hint:"Anexe a foto da amostra física. O pós-venda será notificado.",    accept:"image/*"},
  };
  if(UPLOAD_ETAPAS[etapa]){
    const config=UPLOAD_ETAPAS[etapa];
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        {order.reprogramacao&&(()=>{
          const motivo=etapa==="Amostra Digital"?order.motivoRejAmDigital:etapa==="Amostra Física"?order.motivoRejAmFisica:"";
          return <div style={{background:"#f97316"+"12",border:`1.5px solid #f97316`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:30,height:30,borderRadius:7,background:"#f97316",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...F.title,fontSize:16,color:C.white}}>↻</div>
            <div style={{flex:1}}>
              <div style={{...F.title,fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:"0.06em"}}>REPROGRAMAÇÃO</div>
              <div style={{...F.body,fontSize:12,color:"#9a3412",marginTop:1}}>Este item foi reprovado e voltou para esta etapa. Anexe o novo arquivo — o anterior foi removido.</div>
              {motivo&&<div style={{marginTop:8,padding:"8px 10px",background:C.white,borderRadius:6,border:"1px solid #fed7aa"}}>
                <div style={{...F.body,fontSize:10,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo da reprovação</div>
                <div style={{...F.body,fontSize:13,color:"#7c2d12"}}>{motivo}</div>
              </div>}
            </div>
          </div>;
        })()}
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>{config.title.toUpperCase()}</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>{config.hint}</div>
        </div>
        {/* Arquivos anexados pelo vendedor — referência para a execução (filtrados por etapa) */}
        {(()=>{ const refIds=arquivosBordadoPorEtapa(order,etapa); return refIds.length>0?<div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Arquivos do vendedor (referência)</label>
          <ArquivosBox fileIds={refIds}/>
        </div>:null; })()}
        {/* Upload — aceita VÁRIOS arquivos no mesmo slot */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Arquivos</label>
          <CaixaAnexos files={uploadFiles} setFiles={setUploadFiles} accept={config.accept} inputId="upload-input"/>
        </div>
        {/* Observação */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações (opcional)</label>
          <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={3} placeholder="Informações relevantes sobre este arquivo..."
            style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <button onClick={async()=>{
            if(!uploadFiles.length){alert("Anexe pelo menos um arquivo antes de confirmar.");return;}
            setUploading(true);
            try{
              // Converte TODOS os arquivos do slot em base64
              const arquivos=[];
              for(const f of uploadFiles){
                arquivos.push({fileName:f.name,fileBase64:await arquivoParaBase64(f)});
              }
              const m=await onAction(order.id,"upload",{
                arquivo:arquivos.map(a=>a.fileName).join(", "),obs:obsText,
                arquivos,
                // compat: worker antigo lê o par solto (usa o 1º arquivo)
                fileBase64:arquivos[0].fileBase64,fileName:arquivos[0].fileName,
                propriedade:ETAPA_PROPRIEDADE[etapa],
              });
              setActionMsg(m||"");setActionDone(true);
            }catch(e){alert("Erro no upload: "+e.message);}
            finally{setUploading(false);}
          }}
          disabled={uploading}
          style={{background:uploading?"#ccc":uploadFiles.length?C.red:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"11px 24px",cursor:uploadFiles.length&&!uploading?"pointer":"not-allowed",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
          <Ic n="send" s={15} c={C.white}/> {uploading?"Enviando...":config.btn+(uploadFiles.length>1?` (${uploadFiles.length} arquivos)`:"")}
        </button>
      </div>
    );
  }

  // ── PÓS-VENDA / CS — Aprovação de amostra ─────────────────────────────────
  // ── APROVAÇÃO DE AMOSTRA FÍSICA (vendedor) — anexa (opcional) a amostra
  //    aprovada; pode marcar VÁRIOS bordados e mandar UM arquivo pra todos, e
  //    aprovar junto. Anexo NÃO é obrigatório pra aprovar. ─────────────────────
  if(etapa==="Aprovação de Amostra Física"){
    const bords=order.bordadosJson||[];
    const keyDe=(b,i)=>String(b.id||b.fileId||("idx"+i));
    const isSel=(k)=>selBordFis[k]!==false;
    const selKeys=bords.map((b,i)=>keyDe(b,i)).filter(k=>isSel(k));
    const todosSel=bords.length>0&&selKeys.length===bords.length;
    const fisIds=order.arqAmostraFisica?String(order.arqAmostraFisica).split(";").filter(Boolean):[];
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.amber+"0e",border:`1px solid ${C.amber}40`,borderRadius:8,padding:"14px 16px"}}>
          <div style={{...F.title,fontSize:12,fontWeight:700,color:C.amber,letterSpacing:"0.1em",marginBottom:4}}>APROVAÇÃO DE AMOSTRA FÍSICA</div>
          <div style={{...F.body,fontSize:13,color:C.gray700}}>Após aprovação do cliente, anexe a amostra aprovada (opcional). Você pode marcar vários bordados e enviar o mesmo arquivo para todos.</div>
        </div>
        {fisIds.length>0&&<div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Amostra física já anexada</label>
          <ArquivosBox fileIds={fisIds} emptyText="Nenhuma amostra física anexada ainda."/>
        </div>}
        {/* Seleção de bordados */}
        {bords.length>0&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Bordados que recebem esta amostra</label>
            <button onClick={()=>{ if(todosSel){const m={};bords.forEach((b,i)=>m[keyDe(b,i)]=false);setSelBordFis(m);} else setSelBordFis({}); }}
              style={{...F.body,fontSize:11,fontWeight:700,color:C.blue,background:"none",border:"none",cursor:"pointer"}}>{todosSel?"Desmarcar todos":"Marcar todos"}</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {bords.map((b,i)=>{const k=keyDe(b,i);const on=isSel(k);return(
              <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:on?C.blue+"08":C.gray50,border:`1px solid ${on?C.blue+"55":C.gray200}`,borderRadius:6,cursor:"pointer"}}>
                <input type="checkbox" checked={on} onChange={()=>setSelBordFis(p=>({...p,[k]:!on}))} style={{width:16,height:16,cursor:"pointer"}}/>
                <span style={{...F.body,fontSize:12,color:C.gray700}}>{(b.sku?b.sku+" · ":"")}{b.positionLabel||b.productName||b.fileName||"Bordado"}</span>
              </label>
            );})}
          </div>
        </div>}
        {/* Upload opcional */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Amostra aprovada (opcional · pode anexar várias fotos)</label>
          <CaixaAnexos files={uploadFiles} setFiles={setUploadFiles} accept="image/*" inputId="upload-af-input"
            textoVazio="Clique ou arraste as fotos da amostra aprovada" compacto/>
        </div>
        {/* Motivo reprovação */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Motivo da reprovação <span style={{color:C.gray400,fontWeight:500}}>(obrigatório apenas se REPROVAR)</span></label>
          <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={3} placeholder="Preencha só se o cliente rejeitou. Descreva o que ajustar..."
            style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        {/* Botões */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button disabled={uploading} onClick={async()=>{
              setUploading(true);
              try{
                // Anexo é opcional; quando existe, pode ser mais de um arquivo.
                const arquivos=[];
                for(const f of uploadFiles){
                  arquivos.push({fileName:f.name,fileBase64:await arquivoParaBase64(f)});
                }
                const m=await onAction(order.id,"aprovar_amostra_fisica",{
                  arquivos,
                  fileBase64:arquivos[0]?.fileBase64||null,fileName:arquivos[0]?.fileName||null,
                  bordadoKeys:selKeys,obs:"",
                });
                setActionMsg(m||"");setActionDone(true);
              }catch(e){alert("Erro: "+e.message);}
              finally{setUploading(false);}
            }}
            style={{flex:1,minWidth:160,background:uploading?"#ccc":C.green,color:C.white,border:"none",borderRadius:8,padding:"14px",...F.body,fontWeight:700,fontSize:14,cursor:uploading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic n="check" s={16} c={C.white}/> {uploading?"Enviando...":(uploadFiles.length?`Anexar ${uploadFiles.length>1?uploadFiles.length+" arquivos ":""}e aprovar`:"Amostra Aprovada")}
          </button>
          <button onClick={async()=>{
              if(!obsText.trim()){alert("Pra reprovar, preencha o motivo. A programadora vai usar essa informação para refazer.");return;}
              try{const m=await onAction(order.id,"reprovar_amostra",{obs:obsText});setActionMsg(m||"");setActionDone(true);}catch(e){alert("Erro: "+e.message);}
            }}
            style={{flex:1,minWidth:140,background:C.white,color:C.red,border:`2px solid ${C.red}`,borderRadius:8,padding:"14px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic n="close" s={16} c={C.red}/> Reprovar — Refazer
          </button>
        </div>
        <div style={{...F.body,fontSize:11,color:C.gray400,display:"flex",alignItems:"center",gap:4}}>
          <Ic n="warn" s={11} c={C.gray300}/> Reprovar retorna o pedido para a etapa de Amostra Digital (reprogramação).
        </div>
      </div>
    );
  }

  if(etapa==="Aprovação de Amostra Digital"){
    const ehDigital=etapa==="Aprovação de Amostra Digital";
    const tituloEtapa=ehDigital?"APROVAÇÃO DE AMOSTRA DIGITAL":"APROVAÇÃO DE AMOSTRA FÍSICA";
    const voltaPara=ehDigital?"Amostra Digital":"Amostra Física";
    // Arquivo anexado pelo analista (fileId guardado na propriedade da etapa)
    const fileIdArquivo=ehDigital?order.arqAmostraDigital:order.arqAmostraFisica;
    const fileIds=fileIdArquivo?String(fileIdArquivo).split(";").filter(Boolean):[];
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.amber+"0e",border:`1px solid ${C.amber}40`,borderRadius:8,padding:"14px 16px"}}>
          <div style={{...F.title,fontSize:12,fontWeight:700,color:C.amber,letterSpacing:"0.1em",marginBottom:4}}>{tituloEtapa}</div>
          <div style={{...F.body,fontSize:13,color:C.gray700}}>{ehDigital
            ?"O analista anexou a amostra digital. Veja o arquivo abaixo e, após contato com o cliente, registre a decisão."
            :"A amostra física está pronta. Veja o arquivo abaixo e, após contato com o cliente, registre a decisão."}</div>
        </div>
        {/* Arquivo da amostra anexado pelo analista */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>{ehDigital?"Amostra digital anexada":"Amostra física anexada"}</label>
          <ArquivosBox fileIds={fileIds} emptyText="Nenhum arquivo de amostra anexado ainda."/>
        </div>
        {/* Motivo da reprovação — só usado se Reprovar */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
            Motivo da reprovação <span style={{color:C.gray400,fontWeight:500}}>(obrigatório apenas se REPROVAR)</span>
          </label>
          <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:8,lineHeight:1.4}}>
            Preencha somente se o cliente rejeitou a amostra. Descreva o que precisa ser ajustado — a programadora usará essa informação para refazer.
          </div>
          <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={3} placeholder="Ex: cliente pediu para trocar a cor da linha para verde escuro; ajustar o tamanho da fonte..."
            style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        {/* Botões de decisão */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button onClick={async()=>{try{const m=await onAction(order.id,"aprovar_amostra",{obs:obsText});setActionMsg(m||"");setActionDone(true);}catch(e){alert("Erro: "+e.message);}}}
            style={{flex:1,minWidth:140,background:C.green,color:C.white,border:"none",borderRadius:8,padding:"14px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic n="check" s={16} c={C.white}/> Amostra Aprovada
          </button>
          <button onClick={async()=>{
              if(!obsText.trim()){
                alert("Pra reprovar, preencha o motivo. A programadora vai usar essa informação para refazer.");
                return;
              }
              try{const m=await onAction(order.id,"reprovar_amostra",{obs:obsText});setActionMsg(m||"");setActionDone(true);}catch(e){alert("Erro: "+e.message);}
            }}
            style={{flex:1,minWidth:140,background:C.white,color:C.red,border:`2px solid ${C.red}`,borderRadius:8,padding:"14px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic n="close" s={16} c={C.red}/> Reprovar — Refazer
          </button>
        </div>
        <div style={{...F.body,fontSize:11,color:C.gray400,display:"flex",alignItems:"center",gap:4}}>
          <Ic n="warn" s={11} c={C.gray300}/> Reprovar retorna o pedido para a etapa de {voltaPara} (reprogramação) e remove o arquivo anterior.
        </div>
      </div>
    );
  }

  // ── MOVIMENTAÇÃO SIMPLES (Bordado Interno, Externo, Expedição, Faturamento) ─
  const moveConfig={
    "Em Separação":             {title:"ENVIAR PARA ANÁLISE PCP", sub:"Envie o pedido direto para a Análise PCP quando os itens não puderem ser separados agora (ex.: sem estoque). O analista de PCP decide o encaminhamento.", btn:"Enviar para Análise PCP", icon:"arrow", color:C.red, next:"Análise PCP"},
    "Bordado Interno":          {title:"BORDADO CONCLUÍDO",  sub:"Confirme que o bordado interno foi executado e as peças estão prontas.",        btn:"Confirmar bordado concluído", icon:"check",  color:C.green,  next:"Expedição"},
    "Bordado Externo":          {title:"RETORNO DO EXTERNO", sub:"Confirme o recebimento das peças bordadas pelo fornecedor externo.",            btn:"Confirmar retorno das peças", icon:"inbox",  color:C.purple, next:"Expedição"},
    "Bordado Interno e Externo":{title:"BORDADO CONCLUÍDO",  sub:"Confirme a execução do bordado interno e o retorno do externo.",                btn:"Confirmar bordado concluído", icon:"check",  color:C.green,  next:"Expedição"},
    "Expedição":                {title:"PEDIDO EMBALADO",    sub:"Confirme que o pedido foi embalado e está pronto para análise de frete.",       btn:"Enviar para análise de frete",icon:"box",    color:C.teal,    next:"Análise de Frete"},
    "Análise de Frete":         {title:"ANÁLISE DE FRETE",   sub:"Confirme o cálculo/aprovação do frete. Depois disso o pedido é finalizado — o status de faturamento é atualizado pelo ERP.",  btn:"Finalizar pedido",            icon:"check",  color:"#0891b2", next:"Finalizados"},
  }[etapa]||{title:"MOVIMENTAR PEDIDO",sub:"Confirme a execução desta etapa para avançar o pedido.",btn:"Confirmar e avançar",icon:"arrow",color:C.red,next:""};

  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"14px 16px"}}>
        <div style={{...F.title,fontSize:12,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>{moveConfig.title}</div>
        <div style={{...F.body,fontSize:13,color:C.gray600}}>{moveConfig.sub}</div>
      </div>
      {/* Info do pedido */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        {[["Pedido",order.id],["Cliente",order.client],["Total de peças",String(pecasDoCard(order))],["Valor",fmtR(order.valor)]].map(([k,v])=>(
          <div key={k} style={{background:C.gray50,borderRadius:6,padding:"10px 12px",border:`1px solid ${C.gray200}`}}>
            <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
            <div style={{...F.body,fontSize:13,fontWeight:600,color:C.black}}>{v}</div>
          </div>
        ))}
      </div>
      {/* INFORMAÇÕES GERAIS DO PEDIDO (todas as etapas, quando preenchidas) */}
      {(order.infoImportante||order.obs)&&<div style={{background:"#fffbeb",border:"1px solid #f59e0b55",borderLeft:"5px solid #f59e0b",borderRadius:8,padding:"12px 14px"}}>
        <div style={{...F.title,fontSize:10,color:"#b45309",fontWeight:800,letterSpacing:"0.08em",marginBottom:4,textTransform:"uppercase"}}>Informação importante do pedido</div>
        <div style={{...F.body,fontSize:12.5,color:C.black,lineHeight:1.45,whiteSpace:"pre-wrap",wordBreak:"break-word",fontWeight:600}}>{order.infoImportante||order.obs}</div>
      </div>}
      {order.dadosAdicionais&&<div style={{background:"#f5f3ff",border:"1px solid #7c3aed44",borderLeft:"5px solid #7c3aed",borderRadius:8,padding:"12px 14px"}}>
        <div style={{...F.title,fontSize:10,color:"#6d28d9",fontWeight:800,letterSpacing:"0.08em",marginBottom:4,textTransform:"uppercase"}}>Dados adicionais</div>
        <div style={{...F.body,fontSize:12.5,color:C.black,lineHeight:1.45,whiteSpace:"pre-wrap",wordBreak:"break-word",fontWeight:600}}>{order.dadosAdicionais}</div>
      </div>}
      {/* TRANSPORTADORA + FRETE em destaque (Análise de Frete) — do deal de Vendas */}
      {etapa==="Análise de Frete"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
        <div style={{background:"#0891b210",border:"1.5px solid #0891b244",borderRadius:8,padding:"12px 14px"}}>
          <div style={{...F.body,fontSize:10,color:"#0e7490",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>🚚 Transportadora</div>
          <div style={{...F.body,fontSize:15,fontWeight:800,color:order.transportadora?C.black:C.gray400}}>{order.transportadora||"Não informada"}</div>
        </div>
        <div style={{background:"#0891b210",border:"1.5px solid #0891b244",borderRadius:8,padding:"12px 14px"}}>
          <div style={{...F.body,fontSize:10,color:"#0e7490",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Valor do Frete</div>
          <div style={{...F.body,fontSize:15,fontWeight:800,color:C.black}}>{fmtR(order.valorFrete||0)}{order.pagadorFrete?<span style={{fontSize:12,fontWeight:600,color:C.gray500}}> · Pagador: {order.pagadorFrete}</span>:null}</div>
        </div>
      </div>}
      {/* Status de PAGAMENTO (Análise de Frete) — vem do app de Pagamentos via
          propriedade cit_deal_ready_for_invoicing do deal de Vendas. */}
      {etapa==="Análise de Frete"&&(order.pagamentoLiberado
        ?<div style={{background:C.green+"12",border:`1.5px solid #06534644`,borderRadius:8,padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
          <Ic n="check" s={20} c="#065f46"/>
          <div>
            <div style={{...F.title,fontSize:12,fontWeight:800,color:"#065f46",letterSpacing:"0.04em"}}>PAGAMENTO LIBERADO</div>
            <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:2}}>O total recebido bate com o valor do pedido. Faturamento liberado.</div>
          </div>
        </div>
        :<div style={{background:C.red+"0e",border:`1.5px solid ${C.red}55`,borderRadius:8,padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
          <Ic n="warn" s={20} c={C.red}/>
          <div>
            <div style={{...F.title,fontSize:12,fontWeight:800,color:C.red,letterSpacing:"0.04em"}}>PAGAMENTO PENDENTE</div>
            <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:2}}>O pagamento ainda não foi liberado no app de Pagamentos. Confirme antes de finalizar.</div>
          </div>
        </div>)}
      {/* Resumo financeiro (igual ao app de Pagamentos): valores + barra + pagamentos */}
      {etapa==="Análise de Frete"&&(()=>{
        // Valor total = produtos + frete (mesma régua do app de Pagamentos)
        const valorProd=Number(order.valor||0);
        const valorFre=Number(order.valorFrete||0);
        const valorPed=valorProd+valorFre;
        const recebido=Number(order.totalRecebido||0)||(order.pagamentoLiberado?valorPed:0);
        const pct=valorPed>0?Math.min(100,Math.round(recebido/valorPed*100)):0;
        const corB=pct>=100?"#16a34a":pct>0?"#f59e0b":C.gray300;
        const dif=recebido-valorPed;
        return(
          <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{...F.body,fontSize:12,color:C.gray600,fontWeight:700,marginBottom:10}}>Resumo financeiro</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:12}}>
              {[["Valor do Pedido",fmtR(valorProd),C.gray50,C.black],["Valor do Frete",fmtR(valorFre),C.gray50,C.black],["Valor Total",fmtR(valorPed),"#0891b210","#0e7490"],["Total Recebido",fmtR(recebido),dif>=0?"#16a34a12":"#f59e0b15",dif>=0?"#166534":"#92400e"]].map(([k,v,bg,cor])=>(
                <div key={k} style={{background:bg,borderRadius:6,padding:"8px 10px",border:`1px solid ${C.gray200}`}}>
                  <div style={{...F.body,fontSize:9.5,color:C.gray500,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{k}</div>
                  <div style={{...F.body,fontSize:14.5,fontWeight:800,color:cor}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",...F.body,fontSize:12,color:C.gray600,marginBottom:6}}>
              <span style={{fontWeight:700}}>Pagamento</span>
              <span><strong style={{color:C.black}}>{fmtR(recebido)}</strong> de {fmtR(valorPed)}</span>
            </div>
            <div style={{height:14,background:C.gray100,borderRadius:8,overflow:"hidden",position:"relative"}}>
              <div style={{width:pct+"%",height:"100%",background:corB,borderRadius:8,transition:"width 0.3s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {pct>=15&&<span style={{...F.body,fontSize:9.5,fontWeight:800,color:C.white}}>{pct}%</span>}
              </div>
              {pct<15&&<span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",...F.body,fontSize:9.5,fontWeight:800,color:C.gray500}}>{pct}%</span>}
            </div>
            {dif>0.009&&<div style={{...F.body,fontSize:11.5,color:"#166534",fontWeight:700,marginTop:6}}>Recebido {fmtR(recebido)} (excedente de {fmtR(dif)})</div>}
            {dif<-0.009&&recebido>0&&<div style={{...F.body,fontSize:11.5,color:"#92400e",fontWeight:700,marginTop:6}}>Faltam {fmtR(-dif)} para liberar o faturamento</div>}
            {/* Tabela de pagamentos (lida dos commerce_payments do HubSpot) */}
            {(order.pagamentos||[]).length>0&&<table style={{width:"100%",borderCollapse:"collapse",marginTop:12,...F.body,fontSize:12}}>
              <thead><tr>
                {["Forma","NSU/Comp.","Cartão","Valor"].map(h=>(
                  <th key={h} style={{textAlign:h==="Valor"?"right":"left",padding:"7px 10px",borderBottom:`2px solid ${C.gray200}`,color:C.gray500,fontSize:10.5,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{(order.pagamentos||[]).map((pg,i)=>(
                <tr key={i}>
                  <td style={{padding:"8px 10px",borderBottom:`1px solid ${C.gray100}`}}><span style={{border:`1px solid ${C.gray300}`,borderRadius:12,padding:"2px 10px",fontWeight:700,fontSize:11}}>{pg.forma||"—"}</span></td>
                  <td style={{padding:"8px 10px",borderBottom:`1px solid ${C.gray100}`,color:C.gray700}}>{pg.nsu||pg.comprovante||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:`1px solid ${C.gray100}`,color:C.gray700}}>{pg.cartao||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:`1px solid ${C.gray100}`,textAlign:"right",fontWeight:700,color:C.black}}>{fmtR(Number(pg.valor||0))}</td>
                </tr>
              ))}</tbody>
            </table>}
          </div>
        );
      })()}
      {/* Itens a executar nesta etapa */}
      {order.items&&order.items.length>0&&(
        <div>
          {/* Bordado Interno/Externo: mostra SÓ itens que têm bordado (com bordado===true).
              Outros pedidos (Expedição/Faturamento): mostra tudo. Ordenação por SKU
              agrupa mesmo produto de grades diferentes. */}
          {(() => {
            const isExpFat = etapa==="Expedição"||etapa==="Faturamento";
            const itensBase = isExpFat ? order.items : order.items.filter(it=>it.bordado);
            const itensOrdenados = itensBase.slice().sort((a,b)=>{
              const sa=String(a.sku||""), sb=String(b.sku||"");
              if(sa!==sb) return sa.localeCompare(sb);
              return String(a.cor||"").localeCompare(String(b.cor||""));
            });
            return (
              <>
                <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>{isExpFat?"Todos os itens do pedido":`Itens para ${etapa==="Bordado Externo"?"bordado externo":"bordado"}`} ({itensOrdenados.length})</label>
                <div style={{overflowX:"auto",border:`1px solid ${C.gray200}`,borderRadius:8}}>
                  <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:380}}>
                    <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
                      {["SKU","Descrição","TAM","Qtd",etapa.includes("e Externo")||etapa==="Bordado Interno e Externo"?"Destino":null].filter(Boolean).map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",fontSize:11,color:C.gray500,fontWeight:700,...F.body,textTransform:"uppercase"}}>{hd}</th>)}
                    </tr></thead>
                    <tbody>{itensOrdenados.map((it,i)=>(
                      <tr key={it.id||i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                        <td style={{padding:"8px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700,verticalAlign:"top"}}>{it.sku}</td>
                        <td style={{padding:"8px 10px",...F.body,color:C.gray700,verticalAlign:"top"}}>
                          <div>{it.desc}</div>
                          {it.descricao&&<div style={{
                            marginTop:4,fontSize:11,fontWeight:600,color:"#92400e",
                            background:"#fef3c7",borderLeft:`3px solid #fcd34d`,
                            borderRadius:3,padding:"4px 7px",lineHeight:1.4,
                            whiteSpace:"pre-wrap",wordBreak:"break-word"
                          }}>
                            <strong>📝 Obs vendedor:</strong> {it.descricao}
                          </div>}
                        </td>
                        <td style={{padding:"8px 10px",...F.body,color:C.gray500,fontSize:12,verticalAlign:"top"}}>{it.cor}</td>
                        <td style={{padding:"8px 10px",fontWeight:700,...F.body,verticalAlign:"top"}}>{it.qty}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      )}
      {/* Bordados aprovados + arquivos da programação — usados no Bordado Interno/Externo */}
      {/* Bordados desta etapa — com observações do vendedor em destaque */}
      {(etapa==="Bordado Interno"||etapa==="Bordado Externo"||etapa==="Bordado Interno e Externo") && (() => {
        const bordadosLista = (order.bordadosJson||[]).filter(b => b && (b.fileName||b.fileId));
        if (!bordadosLista.length) return null;
        const ehImg = (n="") => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(n);
        const limpaNome = (n="") => n.replace(/\s*~(PROG|AMOSTRA)/gi,"").trim()||n;
        return (
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Bordados ({bordadosLista.length})</label>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {bordadosLista.map((b,i) => {
                const img = ehImg(b.fileName||"");
                return (
                  <div key={b.fileId||("bk"+i)} style={{border:`1px solid ${C.gray200}`,borderRadius:10,padding:12,display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      {img&&b.fileUrl
                        ?<img src={b.fileUrl} alt="" style={{width:64,height:64,objectFit:"cover",borderRadius:8,border:`1px solid ${C.gray200}`,flexShrink:0}}/>
                        :<div style={{width:64,height:64,borderRadius:8,background:C.gray100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="box" s={24} c={C.gray400}/></div>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,wordBreak:"break-word"}}>{limpaNome(b.fileName)}</div>
                        {b.fileUrl&&<a href={b.fileUrl} target="_blank" rel="noreferrer" download style={{...F.body,fontSize:12,color:C.blue,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,marginTop:4,textDecoration:"none"}}><Ic n="download" s={13} c={C.blue}/> Baixar arquivo</a>}
                      </div>
                    </div>
                    {b.obs_bordado && (
                      <div style={{background:"#fef3c7",border:`2px solid ${C.amber}`,borderLeft:`6px solid ${C.amber}`,borderRadius:8,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                        <div style={{fontSize:22,lineHeight:1,flexShrink:0}}>🧵</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{...F.title,fontSize:11,fontWeight:700,color:"#92400e",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Observação do vendedor para o Bordado</div>
                          <div style={{...F.body,fontSize:14,color:"#78350f",fontWeight:600,lineHeight:1.45,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{b.obs_bordado}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Arquivos da programação e amostras aprovadas — todos os anexos
                que a bordadeira precisa pra bordar corretamente. */}
            {(() => {
              const progIds = String(order.arqProgramacao||"").split(";").filter(Boolean);
              const digIds = String(order.arqAmostraDigital||"").split(";").filter(Boolean);
              const fisIds = String(order.arqAmostraFisica||"").split(";").filter(Boolean);
              if (!progIds.length && !digIds.length && !fisIds.length) return null;
              return (
                <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:14}}>
                  {progIds.length>0&&<div>
                    <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>
                      Arquivos da programação ({progIds.length}) — anexados pela programadora
                    </label>
                    <ArquivosBox fileIds={progIds} emptyText="Nenhum arquivo de programação anexado."/>
                  </div>}
                  {digIds.length>0&&<div>
                    <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>
                      Amostra digital aprovada ({digIds.length})
                    </label>
                    <ArquivosBox fileIds={digIds} emptyText=""/>
                  </div>}
                  {fisIds.length>0&&<div>
                    <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>
                      Amostra física aprovada ({fisIds.length})
                    </label>
                    <ArquivosBox fileIds={fisIds} emptyText=""/>
                  </div>}
                </div>
              );
            })()}
          </div>
        );
      })()}
      {/* Conferência por bipagem (somente Expedição) */}
      {etapa==="Expedição"&&(
        <BipagemExpedicao order={order} user={me} onChange={(r,info)=>{ setBipReady(r); bipInfoRef.current=info||{}; }}/>
      )}
      {/* Observação */}
      <div>
        <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações (opcional)</label>
        <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={2} placeholder="Alguma observação relevante..."
          style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
      </div>
      {moveConfig.next&&<div style={{...F.body,fontSize:12,color:C.gray400,display:"flex",alignItems:"center",gap:4}}>
        <Ic n="arrow" s={12} c={C.gray300}/> Próxima etapa: <strong style={{color:C.gray600,marginLeft:2}}>{moveConfig.next}</strong>
      </div>}
      {etapa==="Expedição"&&!bipReady&&<div style={{...F.body,fontSize:12,color:C.gray400}}>Conclua a conferência por bipagem para liberar o avanço.</div>}
      <button disabled={etapa==="Expedição"&&!bipReady}
        onClick={async()=>{
          try{
            if(etapa==="Em Separação"&&!confirm("Enviar este pedido direto para a Análise PCP? Use quando os itens não puderem ser separados agora."))return;
            if(etapa==="Expedição"){
              const info=bipInfoRef.current||{};
              apiFetch("/bipagem","POST",{
                pedidoId:order.id,posvendaId:order.posvendaId||"",bordadoId:order.bordadoId||"",
                cliente:order.client||"",usuario:me?.email||me?.nome||"",
                totalPedido:info.totalPedido||0,totalBipado:info.totalConferido||0,
                bateu:!!info.bateu,desbloqueado:!!info.desbloqueado,detalhes:info.detalhes||{},
              }).catch(()=>{}); // auditoria não bloqueia o avanço
            }
            const msg=await onAction(order.id,"mover",{obs:obsText}); setActionMsg(msg||""); setActionDone(true);
          }
          catch(e){ alert("Erro ao processar: "+e.message); }
        }}
        style={{background:(etapa==="Expedição"&&!bipReady)?C.gray300:moveConfig.color,color:C.white,border:"none",borderRadius:8,padding:"12px 28px",cursor:(etapa==="Expedição"&&!bipReady)?"not-allowed":"pointer",...F.body,fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
        <Ic n={moveConfig.icon} s={16} c={C.white}/> {moveConfig.btn}
      </button>
    </div>
  );
}

// ─── ORDER MODAL ─────────────────────────────────────────────────────────────
// ─── SUB-ABA "EXECUTADOS" (dentro da Programação) ──────────────────────────
// Lista os bordados que a pessoa já programou/avançou (fonte: relatório de
// programação no Supabase). Por padrão mostra só as dela; dá pra ver de todos.
// Renderizada dentro da Fila da Programação (sem header próprio).
function ExecutadosLista({user,onOpen}){
  const [rows,setRows]=useState(null);
  const [loading,setLoading]=useState(true);
  const [erro,setErro]=useState("");
  const [busca,setBusca]=useState("");
  const [soMeus,setSoMeus]=useState(true);
  const meuNome=user?.nome||user?.email||"";
  const carregar=()=>{
    setLoading(true); setErro("");
    apiFetch("/relatorio-programacao")
      .then(r=>{ setRows(Array.isArray(r.data)?r.data:[]); if(r.aviso) setErro(r.aviso); })
      .catch(e=>setErro(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(()=>{carregar();},[]);
  const limpo=(n="")=>String(n).replace(/\s*~(PROG|AMOSTRA)/gi,"").trim()||n;
  const norm=(s)=>String(s||"").trim().toLowerCase();
  const q=busca.trim().toLowerCase();
  const lista=(rows||[]).filter(r=>{
    if(soMeus && norm(r.programador)!==norm(meuNome)) return false;
    if(!q) return true;
    return [r.nome_arquivo,r.pedido_id,r.dificuldade,r.programador].map(x=>norm(x)).join(" ").includes(q);
  });
  return (
    <div>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por pedido, arquivo, dificuldade..." style={{flex:1,minWidth:220,maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}/>
        <button onClick={()=>setSoMeus(s=>!s)} style={{padding:"9px 14px",borderRadius:8,border:`1.5px solid ${soMeus?C.blue:C.gray300}`,background:soMeus?C.blue+"12":C.white,color:soMeus?C.blue:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:700,whiteSpace:"nowrap"}}>{soMeus?"Só as minhas":"De todos"}</button>
        <button onClick={carregar} disabled={loading} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${C.gray200}`,background:C.white,color:C.gray600,cursor:"pointer",...F.body,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{loading?"...":"↻ Atualizar"}</button>
      </div>
      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando...</div>}
      {erro&&<div style={{padding:"12px 16px",background:C.amber+"14",border:`1px solid ${C.amber}44`,borderRadius:8,...F.body,fontSize:12,color:"#92400e",marginBottom:12}}>{erro}</div>}
      {!loading&&!erro&&<div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>{lista.length} programaç{lista.length!==1?"ões":"ão"}</div>}
      {!loading&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhuma programação encontrada.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {lista.map((r,i)=>{
          const abrir=onOpen&&r.pedido_id?()=>onOpen(normalizarCard({id:"PED-"+r.pedido_id,vendasId:String(r.pedido_id)})):undefined;
          return (
          <div key={i} onClick={abrir} title={abrir?"Abrir pedido":undefined}
            style={{background:C.white,border:`1px solid ${C.gray200}`,borderLeft:`4px solid ${C.green}`,borderRadius:8,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",cursor:abrir?"pointer":"default",transition:"box-shadow 0.15s"}}
            onMouseEnter={e=>{if(abrir)e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="";}}>
            <div style={{flex:1,minWidth:200}}>
              <div style={{...F.body,fontSize:13,fontWeight:700,color:C.gray700,wordBreak:"break-word"}}>{limpo(r.nome_arquivo)}</div>
              <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:3}}>
                Pedido <strong>{r.pedido_id||"—"}</strong>{!soMeus&&r.programador?` · ${r.programador}`:""}{r.data_execucao?` · ${new Date(r.data_execucao).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}`:""}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {r.dificuldade&&<Tag label={r.dificuldade} color={r.dificuldade==="Fácil"?C.green:r.dificuldade==="Médio"?C.amber:C.red}/>}
              {abrir&&<Ic n="chevR" s={16} c={C.gray400}/>}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// Botão ADMIN de substituir o arquivo de uma etapa (ex.: amostra física anexada
// errada) SEM mexer no fluxo/etapa do pedido. Usa /upload-etapa sem novaEtapa:
// sobe o arquivo novo e sobrescreve a propriedade nos 3 deals + nota de auditoria.
function SubstituirArquivoBtn({bordadoId,propriedade,rotulo,me}){
  const [rodando,setRodando]=useState(false);
  const inputRef=useRef(null);
  if(!(me&&me.admin)||!bordadoId)return null;
  const onFile=async(e)=>{
    // Aceita VÁRIOS arquivos: o slot passa a ter todos os selecionados.
    const fs=Array.from(e.target.files||[]);
    e.target.value="";
    if(!fs.length)return;
    const nomes=fs.map(f=>f.name).join(", ");
    if(!confirm(`Substituir o arquivo de "${rotulo}" por ${fs.length>1?fs.length+" arquivos":`"${nomes}"`}?\n\n${fs.length>1?nomes+"\n\n":""}O(s) arquivo(s) anterior(es) deixa(m) de ser exibido(s) (ficam no histórico do HubSpot). A etapa do pedido NÃO muda.`))return;
    setRodando(true);
    try{
      const arquivos=[];
      for(const f of fs){ arquivos.push({fileName:f.name,fileBase64:await arquivoParaBase64(f)}); }
      const r=await apiFetch(`/upload-etapa/${bordadoId}`,"POST",{
        propriedade,arquivos,
        fileBase64:arquivos[0].fileBase64,fileName:arquivos[0].fileName,
        nota:`Arquivo de ${rotulo} SUBSTITUÍDO por ${arquivos.length} (correção de anexo errado): ${nomes}`,
        ctx:{executor:me?.nome||me?.email||"Admin SGP"},
      },{timeoutMs:UPLOAD_TIMEOUT_MS});
      if(r&&r.success)alert(`${fs.length>1?fs.length+" arquivos substituíram":"Arquivo substituído"} com sucesso. Feche e reabra o pedido pra ver o novo anexo.`);
      else throw new Error((r&&r.error)||"Erro desconhecido");
    }catch(err){alert("Erro ao substituir: "+err.message);}
    finally{setRodando(false);}
  };
  return(
    <>
      <input ref={inputRef} type="file" multiple style={{display:"none"}} onChange={onFile}/>
      <button onClick={()=>inputRef.current&&inputRef.current.click()} disabled={rodando}
        title="Substituir o arquivo desta etapa sem alterar o fluxo (admin)"
        style={{background:C.white,border:`1.5px solid ${C.amber}`,borderRadius:6,padding:"4px 10px",cursor:rodando?"wait":"pointer",...F.body,fontSize:11,fontWeight:700,color:"#92400e",display:"inline-flex",alignItems:"center",gap:5,marginLeft:10}}>
        {rodando?"Enviando...":"↻ Substituir arquivo"}
      </button>
    </>
  );
}

function OrderModal({order: _orderLeve,me,onClose,usuarios,onAction,isMobile,slaCfg}){
  // Carrega detalhes completos sob demanda (sem essa busca, o snapshot fica leve e
  // a lista carrega rápido — só pagamos o custo de detalhes quando o usuário abre).
  const [_enriched,_setEnriched]=useState(null);
  const [_loadingDet,_setLoadingDet]=useState(false);
  // Ref pra rastrear se ExecPorBordado tem anexos ainda não salvos
  const pendenciasRef = useRef(0);
  const setTemPendencias = (n) => { pendenciasRef.current = n; };
  const onCloseSeguro = () => {
    if (pendenciasRef.current > 0) {
      const n = pendenciasRef.current;
      const ok = window.confirm(
        `Você tem ${n} arquivo${n!==1?"s":""} anexado${n!==1?"s":""} mas ainda não enviou.\n\n` +
        `Se fechar agora, ${n>1?"os anexos serão perdidos":"o anexo será perdido"} e você vai precisar anexar de novo.\n\n` +
        `Deseja fechar mesmo assim?`
      );
      if (!ok) return;
    }
    onClose();
  };
  useEffect(()=>{
    if(!_orderLeve)return;
    _setEnriched(null);
    setSepEdits({}); setSepMsg("");
    const params=_orderLeve.posvendaId?"?posvenda="+_orderLeve.posvendaId
                :_orderLeve.bordadoId?"?bordado="+_orderLeve.bordadoId
                :_orderLeve.vendasId?"?vendas="+_orderLeve.vendasId:null;
    if(!params){_setLoadingDet(false);return;}
    _setLoadingDet(true);
    apiFetch("/pedido-completo"+params).then(r=>{
      if(r&&r.success&&r.card)_setEnriched(normalizarCard(r.card,r.card.etapa));
    }).catch(()=>{}).finally(()=>_setLoadingDet(false));
  },[_orderLeve?.posvendaId,_orderLeve?.bordadoId,_orderLeve?.vendasId]);
  // Mescla: dados leves sempre existem (vindo do snapshot); enriched preenche
  // items, historico, timeline, contato, etc, quando termina de carregar.
  // IMPORTANTE: preservamos os campos que o snapshot calculou (etapa, stageId,
  // pedidoLinx) sobre os do enriched — porque o snapshot já junta pós-venda +
  // bordado e sabe a etapa granular ("Programação", não "Em Processo de Bordado").
  const order=_enriched?{
    ..._enriched,
    etapa: _orderLeve.etapa || _enriched.etapa,
    stageId: _orderLeve.stageId || _enriched.stageId,
    stageIdAtual: _orderLeve.stageIdAtual || _enriched.stageIdAtual,
    pedidoLinx: _orderLeve.pedidoLinx || _enriched.pedidoLinx,
    aguardadoPor: (_orderLeve.aguardadoPor&&_orderLeve.aguardadoPor.length)?_orderLeve.aguardadoPor:(_enriched.aguardadoPor||[]),
    bordadoId: _orderLeve.bordadoId||_enriched.bordadoId,
    posvendaId: _orderLeve.posvendaId||_enriched.posvendaId,
    vendasId: _orderLeve.vendasId||_enriched.vendasId,
    id: _orderLeve.id||_enriched.id,
    // Se snapshot leve sabe que tem bordado (bordadoId existe), respeita.
    // O enriched às vezes lê pedido_com_bordado do deal e vem false por dado
    // desatualizado — o bordadoId é a verdade.
    temBordado: !!(_orderLeve.bordadoId) || _enriched.temBordado || _orderLeve.temBordado,
    // Preserva etapasAtivas do snapshot (não vem no enriched)
    etapasAtivas: _orderLeve.etapasAtivas || _enriched.etapasAtivas || [_orderLeve.etapa],
    // Pagamento liberado (cit_deal_ready_for_invoicing do deal de Vendas): prefere
    // o valor do snapshot/leve quando definido; senão cai pro enriched.
    pagamentoLiberado: (_orderLeve.pagamentoLiberado!==undefined?_orderLeve.pagamentoLiberado:_enriched.pagamentoLiberado)||false,
    // Transportadora + frete (do deal de Vendas): o snapshot já traz certo;
    // preserva sobre o enriched (que pode vir vazio se a associação falhar).
    transportadora: _orderLeve.transportadora || _enriched.transportadora || "",
    valorFrete: _orderLeve.valorFrete || _enriched.valorFrete || 0,
    pagadorFrete: _orderLeve.pagadorFrete || _enriched.pagadorFrete || "",
    pagamentos: (_orderLeve.pagamentos&&_orderLeve.pagamentos.length)?_orderLeve.pagamentos:(_enriched.pagamentos||[]),
    totalRecebido: _orderLeve.totalRecebido || _enriched.totalRecebido || 0,
    infoImportante: _orderLeve.infoImportante || _enriched.infoImportante || "",
    dadosAdicionais: _orderLeve.dadosAdicionais || _enriched.dadosAdicionais || "",
    centroCusto: _orderLeve.centroCusto || _enriched.centroCusto || "",
    tipo: _orderLeve.tipo || _enriched.tipo || "",
    numeroOP: _orderLeve.numeroOP || _enriched.numeroOP || "",
    tipoPedido: _orderLeve.tipoPedido || _enriched.tipoPedido || "",
    formularioSobMedida: (_orderLeve.formularioSobMedida&&_orderLeve.formularioSobMedida.length)
      ? _orderLeve.formularioSobMedida : (_enriched.formularioSobMedida||[]),
    // Fechamento do pedido (closedate do Vendas) — base do prazo sob medida.
    // O detalhe enriquecido devolve esse dado com outro nome (closedate /
    // prazoFinal), então sem esta linha o campo sumia ao abrir o pedido e o
    // prazo aparecia como "emissão não informada".
    dataFechamento: _orderLeve.dataFechamento || _enriched.dataFechamento
      || _enriched.closedate || _enriched.prazoFinal || null,
    // Ocorrência: o card leve é a fonte confiável (vem do funil de origem).
    ehOcorrencia: _orderLeve.ehOcorrencia || _enriched.ehOcorrencia || false,
    ocorrenciaId: _orderLeve.ocorrenciaId || _enriched.ocorrenciaId || "",
    ocorrenciaTipo: _orderLeve.ocorrenciaTipo || _enriched.ocorrenciaTipo || "",
    ocorrenciaParecer: _orderLeve.ocorrenciaParecer || _enriched.ocorrenciaParecer || "",
    ocorrenciaMotivo: _orderLeve.ocorrenciaMotivo || _enriched.ocorrenciaMotivo || "",
    ocorrenciaRelato: _orderLeve.ocorrenciaRelato || _enriched.ocorrenciaRelato || "",
    improcPosvendaOk: _orderLeve.improcPosvendaOk || _enriched.improcPosvendaOk || false,
    improcSeparacaoOk: _orderLeve.improcSeparacaoOk || _enriched.improcSeparacaoOk || false,
  }:_orderLeve;
  const ETAPAS_COM_ACAO=["Em Separação","Conferência e Direcionamento","Programação","Amostra Digital","Amostra Física","Aprovação de Amostra Digital","Aprovação de Amostra Física","Bordado Interno","Bordado Externo","Bordado Interno e Externo","Expedição","Análise de Frete",
    // Sob medida: sem isto o pedido abria sem a aba Executar e a ação só existia
    // no botão da fila — quem abria pra conferir o formulário ficava sem saída.
    "Criação de OP Sob Medida","Aguardando Produção Sob Medida"];
  // A "etapa efetiva" é a que o USUÁRIO abriu (vinda da tela — ex.: "Separação"
  // via aba Separação). Se abriu de uma tela sem etapa específica, cai na
  // etapa real do card. Isso deixa a mesma order abrir sem ações quando vista
  // pela Separação e com ações quando vista pela Programação.
  const etapaEfetiva = _orderLeve?._etapaOrigem || order.etapa;
  // Só mostra ações se a etapa efetiva REALMENTE tem ação nessa etapa E é
  // igual à etapa real do card (senão veio de outra tela só pra ver).
  const defaultTab = (ETAPAS_COM_ACAO.includes(etapaEfetiva) && etapaEfetiva===order.etapa) ? "acao" : "info";
  const[tab,setTab]=useState(defaultTab);
  const[modalPend,setModalPend]=useState(false);
  const[motivoPend,setMotivoPend]=useState("");
  const[modalAguard,setModalAguard]=useState(false);
  const[modalVoltar,setModalVoltar]=useState(false);
  const[etapaVoltarSel,setEtapaVoltarSel]=useState("");
  const[motivoVoltar,setMotivoVoltar]=useState("");
  const[voltando,setVoltando]=useState(false);
  const[gerandoBordado,setGerandoBordado]=useState(false);
  const[cancelandoBordado,setCancelandoBordado]=useState(false);
  const[corrigindoSilk,setCorrigindoSilk]=useState(false);   // correção pedido bordado -> silk/DTF
  const[cancelandoPedido,setCancelandoPedido]=useState(false); // cancelamento do pedido inteiro
  const[sincItens,setSincItens]=useState(false);
  const[attObs,setAttObs]=useState(false);
  const[modalGerar,setModalGerar]=useState(false);
  const[motivoAguard,setMotivoAguard]=useState("");
  const[pedidoDep,setPedidoDep]=useState("");           // vendasId do pedido escolhido
  const[pedidoDepBusca,setPedidoDepBusca]=useState(""); // texto de busca
  const[pedidoDepSel,setPedidoDepSel]=useState(null);   // {vendasId, pedidoLinx, client}
  const _snapDep=useSnapshotAberto();
  // Anexo do slot da etapa — LISTA (o mesmo slot aceita vários arquivos).
  const[uploadFiles,setUploadFiles]=useState([]);
  const[obsText,setObsText]=useState("");
  const[actionDone,setActionDone]=useState(false);
  const[actionMsg,setActionMsg]=useState("");
  // Edição manual da quantidade separada (só nas etapas de separação/conferência)
  const[sepEdits,setSepEdits]=useState({});   // objId -> valor (string) editado
  const[savingSep,setSavingSep]=useState(false);
  const[sepMsg,setSepMsg]=useState("");
  // Direcionamento local state — apenas itens COM bordado precisam de direcionamento.
  // Fallback (pedido legado sem a flag em nenhum item): usa todos os itens.
  const itensComBordado=order.items.filter(it=>it.bordado);
  const itensDirecionaveis=itensComBordado.length?itensComBordado:order.items;
  const skus=itensDirecionaveis.map(it=>it.sku);
  const itemKeys=itensDirecionaveis.map((it,i)=>it.id||i);
  // Edição da separação: liberada só quando o pedido está em Em Separação ou
  // Conferência Separação (o worker também valida isso pelo dealstage).
  const podeEditarSep = ["1377587072","1377587077"].includes(order.stageIdPV||"")
    || [order.etapa,...(order.etapasAtivas||[])].some(e=>e==="Em Separação"||e==="Conferência Separação");
  const salvarSeparacao=async()=>{
    if(!order.posvendaId){alert("Pedido sem negócio de Pós-venda.");return;}
    const alterados=(order.items||[])
      .filter(it=>!it.naoSeparavel && it.id && (it.id in sepEdits))
      .map(it=>({objId:it.id, qtdSeparada:Number(sepEdits[it.id])}))
      .filter(it=>!isNaN(it.qtdSeparada) && it.qtdSeparada>=0
        && it.qtdSeparada !== Number((order.items.find(x=>x.id===it.objId)?.qtdSeparada)||0));
    if(!alterados.length){setSepMsg("Nenhuma alteração para salvar.");return;}
    setSavingSep(true); setSepMsg("");
    try{
      const r=await apiFetch("/editar-separacao/"+order.posvendaId,"POST",{itens:alterados,ctx:{executor:me?.nome||"Usuário SGP"}});
      if(r.success){
        const falhas=(r.resultados||[]).filter(x=>!x.ok).length;
        setSepMsg(falhas?`Salvo com ${falhas} falha(s). Confira.`:"Quantidades salvas no HubSpot ✓");
      } else setSepMsg("Erro: "+(r.error||"desconhecido"));
    }catch(e){ setSepMsg("Erro: "+e.message); }
    finally{ setSavingSep(false); }
  };
  const[itemSel,setItemSel]=useState({});
  const[itemDest,setItemDest]=useState(()=>{const m={};order.items.forEach((it,i)=>{if(it.dest)m[it.id||i]=it.dest;});return m;});
  // Quando items chegam pelo enriquecimento sob demanda (eram [] no card leve),
  // refaz o itemDest pra incorporar os dest pré-existentes que vieram do HubSpot.
  useEffect(()=>{
    if(!order.items||!order.items.length)return;
    setItemDest(prev=>{
      let mudou=false;
      const novo={...prev};
      order.items.forEach((it,i)=>{
        const key=it.id||i;
        if(it.dest&&!novo[key]){novo[key]=it.dest;mudou=true;}
      });
      return mudou?novo:prev;
    });
  },[order.items.length]);
  const nSel=skus.filter(s=>itemSel[s]).length;
  const allDestDefined=itensDirecionaveis.every((it,i)=>itemDest[it.id||i]);
  const toggleItemSel=(key)=>setItemSel(p=>({...p,[key]:!p[key]}));
  const selAllItems=()=>{const allOn=itemKeys.every(k=>itemSel[k]);const n={};itemKeys.forEach(k=>n[k]=!allOn);setItemSel(n);};
  const setDestSel=(dest)=>{const selKeys=itemKeys.filter(k=>itemSel[k]);if(!selKeys.length){alert("Selecione ao menos um item.");return;}setItemDest(p=>{const n={...p};selKeys.forEach(k=>n[k]=dest);return n;});};
  const setDestAll=(dest)=>{const n={};itemKeys.forEach(k=>n[k]=dest);setItemDest(n);};
  const setDestOne=(key,dest)=>setItemDest(p=>({...p,[key]:dest}));
  const total=pecasDoCard(order);
  const sla=getSLA(order,slaCfg);
  // A aba Executar aparece quando a etapa atual do pedido tem uma ação possível
  // E o usuário veio de uma tela que corresponde a essa etapa (ex.: Programação).
  // Quem abre da Separação vê o card sem ações — mesmo pedido, mas essa aba
  // não tem execução.
  const hasAction=ETAPAS_COM_ACAO.includes(order.etapa) && etapaEfetiva===order.etapa;
  const TABS=[
    ...(order.etapa==="Programação"?[]:[{id:"info",l:"Negócio"}]),
    {id:"sla",l:"SLA / Prazo"},
    {id:"bordado",l:"Bordado"},
    {id:"itens",l:"Todos os itens"},
    {id:"tl",l:"Timeline"},
    {id:"alteracao",l:order.houveAlteracaoForm?"⚠ Alteração de Formulário":"Alteração de Formulário"},
    {id:"chat",l:"Conversa"},
    ...(hasAction?[{id:"acao",l:"▶ Executar"}]:[]),
  ];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?0:16}}>
      <div style={{background:C.white,borderRadius:isMobile?0:10,width:"100%",maxWidth:900,maxHeight:isMobile?"100dvh":"92vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.gray200}`,display:"flex",flexDirection:"column",gap:12,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{...F.title,fontSize:17,fontWeight:700,color:C.black,whiteSpace:"nowrap"}}>{idPedido(order)}</span>
              <TagCentroCusto cc={order.centroCusto}/>
              <TagTipo tipo={order.tipo}/>
              {/* OCORRÊNCIA: peça de devolução — precisa ficar evidente em toda tela */}
              {order.ehOcorrencia&&<TagOcorrencia/>}
              {/* SOB MEDIDA: destaque + nº da OP quando já registrada */}
              {/sob\s*medida/i.test(order.tipoPedido||"")&&<span style={{...F.title,fontSize:10,fontWeight:800,letterSpacing:"0.05em",padding:"3px 9px",borderRadius:6,background:"#fef3c7",color:"#92400e",border:"1px solid #f59e0b",whiteSpace:"nowrap"}}>SOB MEDIDA</span>}
              {order.numeroOP&&<span style={{...F.title,fontSize:10,fontWeight:800,letterSpacing:"0.05em",padding:"3px 9px",borderRadius:6,background:"#e8f5ec",color:"#0d4d24",border:"1px solid #4a8f5f",whiteSpace:"nowrap"}}>OP {order.numeroOP}</span>}
              <ETag etapa={order.etapa}/><TagDataEspecial o={order}/>
              {order.houveAlteracaoForm&&<Tag label="⚠ Já houve alteração de formulário" color="#b45309"/>}
              {order.temBordado===false&&<Tag label="Sem bordado" color={C.gray600}/>}
              {(sla.st==="late"||sla.st==="risk"||sla.ft==="late"||sla.ft==="risk")&&<Tag label={sla.st==="late"||sla.ft==="late"?"Prazo vencido":"Em risco"} color={sla.st==="late"||sla.ft==="late"?C.red:C.amber}/>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,flexWrap:"wrap"}}>
              <BadgeSeparacao status={statusSepDoOrder(order)} qtdSep={order.qtdSeparada} qtdTot={order.qtdTotal} qtdItensSep={order.qtdItensSeparados} totalItens={order.totalItensSeparacao} size="lg"/>
            </div>
            <div style={{...F.body,fontSize:13,color:C.gray600,marginTop:6,fontWeight:600}}>{order.client}</div>
            <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:2}}>{order.vendedor}{order.etapa!=="Programação"?` · ${pecasDoCard(order)} peças · ${fmtR(order.valor)}`:""}</div>
            {(()=>{const rp=responsavelPosVendaDe(order.vendedor);return rp?<div style={{...F.body,fontSize:12,color:"#7c3aed",fontWeight:700,marginTop:4,display:"inline-flex",alignItems:"center",gap:5,background:"#7c3aed12",border:"1px solid #7c3aed40",borderRadius:6,padding:"3px 9px"}}><Ic n="phone" s={12} c="#7c3aed"/> Responsável Pós-Venda: {rp}</div>:null;})()}
            {(order.aguardadoPor||[]).length>0&&<div style={{marginTop:6,background:"#1d4ed80e",border:"1px solid #1d4ed83a",borderLeft:"4px solid #1d4ed8",borderRadius:8,padding:"8px 12px"}}>
              <div style={{...F.title,fontSize:11,fontWeight:800,color:"#1d4ed8",letterSpacing:"0.04em",marginBottom:2}}>🔗 AGUARDANDO FATURAR JUNTO</div>
              {order.aguardadoPor.map((a,i)=><div key={i} style={{...F.body,fontSize:12.5,color:"#1e3a8a"}}><strong>PED-{a.pedido}</strong> está aguardando para ser faturado junto com este pedido{a.motivo?` — ${a.motivo}`:""}.</div>)}
            </div>}
          </div>
            <button onClick={onCloseSeguro} title="Fechar" style={{background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0}}><Ic n="close" s={18} c={C.gray400}/></button>
          </div>
          {/* Barra de ações — faixa própria que quebra linha sem espremer o título */}
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <button
              onClick={()=>setModalPend(true)}
              title="Enviar para Pendência Comercial"
              style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:6,padding:"7px 12px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.gray50;e.currentTarget.style.borderColor=C.gray400;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.borderColor=C.gray300;}}>
              <Ic n="arrow" s={13} c={C.gray700}/> Enviar p/ Pendência Comercial
            </button>
            <button
              onClick={()=>setModalAguard(true)}
              title="Aguardar outro pedido"
              style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:6,padding:"7px 12px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.gray50;e.currentTarget.style.borderColor=C.gray400;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.borderColor=C.gray300;}}>
              <Ic n="arrow" s={13} c={C.gray700}/> Aguardar outro pedido
            </button>
            {me&&me.admin&&<button
              onClick={()=>{setEtapaVoltarSel("");setMotivoVoltar("");setModalVoltar(true);}}
              title="Alterar a etapa do pedido (avançar ou voltar)"
              style={{background:C.white,border:`1.5px solid ${C.amber}`,borderRadius:6,padding:"7px 12px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:"#92400e",fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.amber+"12";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="arrow" s={13} c="#92400e"/> Alterar Etapa
            </button>}
            {me&&me.admin&&!order.bordadoId&&(order.bordadosJson||[]).some(b=>b&&(b.sku||b.productId))&&<button
              disabled={gerandoBordado}
              onClick={()=>setModalGerar(true)}
              title="Gerar o bordado a partir dos arquivos já anexados"
              style={{background:C.white,border:`1.5px solid ${C.purple}`,borderRadius:6,padding:"7px 12px",cursor:gerandoBordado?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.purple,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!gerandoBordado)e.currentTarget.style.background=C.purple+"12";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="needle" s={13} c={C.purple}/> {gerandoBordado?"Gerando...":"Gerar Bordado"}
            </button>}
            {/* Oposto do Gerar Bordado: cliente desistiu do bordado. Limpar os
                arquivos no HubSpot não basta — o SGP monta o quadro pelos
                NEGÓCIOS, então o deal de Bordado precisa ser encerrado. */}
            {me&&me.admin&&order.bordadoId&&<button
              disabled={cancelandoBordado}
              onClick={async()=>{
                const mot=window.prompt("Cancelar o bordado deste pedido?\n\nO negócio de Bordado será finalizado, o pedido seguirá SEM bordado e os itens serão desmarcados.\n\nMotivo:","Cancelado pelo cliente");
                if(mot===null)return;
                if(!String(mot).trim()){alert("O motivo é obrigatório.");return;}
                setCancelandoBordado(true);
                try{
                  const r=await apiFetch(`/cancelar-bordado/${order.vendasId}`,"POST",{motivo:mot,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
                  if(r.success){
                    alert("Bordado cancelado."+(r.itensLimpos?` ${r.itensLimpos} item(ns) desmarcado(s).`:"")+(r.aviso?`\n\n${r.aviso}`:""));
                    onClose();
                  } else alert("Erro: "+(r.error||"desconhecido"));
                }catch(e){alert("Erro: "+e.message);}
                finally{setCancelandoBordado(false);}
              }}
              title="Cliente desistiu do bordado — encerra o bordado e segue como pedido comum"
              style={{background:C.white,border:`1.5px solid ${C.red}`,borderRadius:6,padding:"7px 12px",cursor:cancelandoBordado?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.red,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!cancelandoBordado)e.currentTarget.style.background=C.red+"0e";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="close" s={13} c={C.red}/> {cancelandoBordado?"Cancelando...":"Cancelar Bordado"}
            </button>}
            {/* Pedido lançado como bordado que na verdade é silk/DTF (o vendedor
                marcou "tem bordado" no item e anexou a arte no campo de DTF).
                Encerra o bordado, desmarca os itens e manda pra caixa Silk/DTF
                numa ação só — sempre mostrando antes o que vai mudar. */}
            {me&&me.admin&&<button
              disabled={corrigindoSilk}
              onClick={async()=>{
                setCorrigindoSilk(true);
                try{
                  // 1º passo: simulação. Nada é alterado.
                  const p=await apiFetch(`/corrigir-para-silk-dtf/${order.vendasId}`,"POST",{ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
                  if(p.error){alert("Não é possível corrigir:\n\n"+p.error);return;}
                  const resumo=
                    `Corrigir o pedido ${p.linx?"PED - "+p.linx:order.vendasId} para SILK/DTF?\n\n`+
                    `Itens de silk/DTF encontrados:\n  • ${(p.itensSilk||[]).join("\n  • ")}\n\n`+
                    (p.bordadoId?`O bordado (${p.etapaBordadoAtual}) será ENCERRADO.\n`:"")+
                    ((p.itensDesmarcar||[]).length?`${p.itensDesmarcar.length} item(ns) serão desmarcados como bordado.\n`:"")+
                    (p.posvendaId?`O pedido sai de "${p.etapaPvAtual}" e vai para a caixa Silk/DTF.\n`:"")+
                    (p.aviso?`\n⚠ ${p.aviso}\n`:"");
                  if(!window.confirm(resumo))return;
                  const mot=window.prompt("Motivo da correção (fica registrado na timeline):","Itens são DTF — pedido foi lançado como bordado por engano");
                  if(mot===null)return;
                  if(!String(mot).trim()){alert("O motivo é obrigatório.");return;}
                  const r=await apiFetch(`/corrigir-para-silk-dtf/${order.vendasId}`,"POST",
                    {executar:true,motivo:mot,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
                  if(r.success){
                    alert(`Pedido corrigido para Silk/DTF.${r.itensLimpos?` ${r.itensLimpos} item(ns) desmarcado(s).`:""}`);
                    onClose();
                  } else alert("Erro: "+(r.error||"desconhecido"));
                }catch(e){alert("Erro: "+e.message);}
                finally{setCorrigindoSilk(false);}
              }}
              title="O pedido é silk/DTF mas entrou no fluxo de bordado — encerra o bordado e envia para Silk/DTF"
              style={{background:C.white,border:`1.5px solid ${C.purple}`,borderRadius:6,padding:"7px 12px",cursor:corrigindoSilk?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.purple,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!corrigindoSilk)e.currentTarget.style.background=C.purple+"0e";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="image" s={13} c={C.purple}/> {corrigindoSilk?"Corrigindo...":"É Silk/DTF"}
            </button>}
            {/* Cancelar o pedido inteiro. NÃO exclua o pós-venda pra isso: o
                bordado fica órfão, o histórico some dos indicadores e a
                integração pode recriar o negócio. Aqui o pedido vai pra etapa
                Cancelamento — sai das filas e mantém o rastro. */}
            {me&&me.admin&&<button
              disabled={cancelandoPedido}
              onClick={async()=>{
                const mot=window.prompt(
                  "Cancelar este pedido?\n\nO pedido sai de todas as filas do SGP e vai para a etapa Cancelamento. O bordado, se ainda estiver ativo, é encerrado, e o cliente passa a ver \"Pedido cancelado\" no rastreio.\n\nO histórico é preservado.\n\nMotivo:",
                  "Cancelado pelo cliente");
                if(mot===null)return;
                if(!String(mot).trim()){alert("O motivo é obrigatório.");return;}
                setCancelandoPedido(true);
                try{
                  const r=await apiFetch(`/cancelar-pedido/${order.vendasId}`,"POST",
                    {motivo:mot,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
                  if(r.success){
                    alert("Pedido cancelado."+(r.itensLimpos?` ${r.itensLimpos} item(ns) com direcionamento limpo.`:""));
                    onClose();
                  } else alert("Erro: "+(r.error||"desconhecido"));
                }catch(e){alert("Erro: "+e.message);}
                finally{setCancelandoPedido(false);}
              }}
              title="Cancela o pedido: sai das filas, mantém o histórico e o cliente vê 'Pedido cancelado' no rastreio"
              style={{background:C.white,border:`1.5px solid ${C.gray600}`,borderRadius:6,padding:"7px 12px",cursor:cancelandoPedido?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!cancelandoPedido)e.currentTarget.style.background=C.gray50;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="close" s={13} c={C.gray700}/> {cancelandoPedido?"Cancelando...":"Cancelar Pedido"}
            </button>}
            {/* Itens do SGP vêm do objeto Pedidos Aprovados, criado na integração.
                A automação só CRIA — se o item sair do pedido depois, o registro
                fica órfão e continua na lista. Aqui a gente compara com os line
                items atuais do Vendas e remove o que não existe mais. */}
            {me&&me.admin&&<button
              disabled={sincItens}
              onClick={async()=>{
                setSincItens(true);
                try{
                  const p=await apiFetch(`/sincronizar-itens/${order.vendasId}`,"POST",{});
                  if(p.error){alert("Erro: "+p.error);return;}
                  if(!p.total){alert("Nenhum item sobrando — a lista já está igual ao pedido.");return;}
                  const resumo=p.orfaos.map(o=>`• ${o.sku||""} ${o.nome} ${o.tamanho||""} (qtd ${o.quantidade})${o.jaSeparado?" — JÁ TEM BIPAGEM":""}`).join("\n");
                  if(!confirm(`Estes ${p.total} item(ns) não existem mais no pedido e serão removidos:\n\n${resumo}\n\nConfirmar?`))return;
                  const r=await apiFetch(`/sincronizar-itens/${order.vendasId}`,"POST",{executar:true,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
                  if(r.success){alert(`${r.removidos} item(ns) removido(s).`);onClose();}
                  else alert("Erro: "+(r.error||"desconhecido"));
                }catch(e){alert("Erro: "+e.message);}
                finally{setSincItens(false);}
              }}
              title="Remove da lista os itens que já não existem mais no pedido"
              style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:6,padding:"7px 12px",cursor:sincItens?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!sincItens)e.currentTarget.style.background=C.gray50;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="refresh" s={13} c={C.gray700}/> {sincItens?"Conferindo...":"Sincronizar Itens"}
            </button>}
            {/* A observação dos itens é lida do pedido e guardada em cache (12h).
                Se o comercial corrigir o texto, isto relê na hora. */}
            {me&&me.admin&&<button
              disabled={attObs}
              onClick={async()=>{
                setAttObs(true);
                try{
                  const r=await apiFetch(`/atualizar-obs/${order.vendasId}`,"POST",{});
                  if(r.error){alert("Erro: "+r.error);return;}
                  alert(r.observacao
                    ? `Observação relida do pedido:\n\n${r.observacao}`
                    : "O pedido não tem observação nos itens.");
                  onClose();
                }catch(e){alert("Erro: "+e.message);}
                finally{setAttObs(false);}
              }}
              title="Relê a observação dos itens direto do pedido, ignorando o cache"
              style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:6,padding:"7px 12px",cursor:attObs?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!attObs)e.currentTarget.style.background=C.gray50;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="refresh" s={13} c={C.gray700}/> {attObs?"Relendo...":"Atualizar Observação"}
            </button>}
            {/* Recupera a lista de itens a partir dos itens de linha do pedido.
                Só aparece quando o pedido está SEM item nenhum no SGP. */}
            {me&&me.admin&&(order.items||[]).length===0&&<button
              disabled={sincItens}
              onClick={async()=>{
                setSincItens(true);
                try{
                  const p=await apiFetch(`/recriar-itens/${order.vendasId}`,"POST",{});
                  if(p.error){alert("Erro: "+p.error);return;}
                  const resumo=p.itens.slice(0,25).map(i=>`• ${i.sku} ${i.nome} — ${i.tamanho} ×${i.quantidade}`).join("\n");
                  if(!confirm(`Recriar ${p.total} item(ns) a partir do pedido?\n\n${resumo}${p.total>25?`\n... e mais ${p.total-25}`:""}\n\n⚠ A quantidade já separada volta ZERADA.`))return;
                  const r=await apiFetch(`/recriar-itens/${order.vendasId}`,"POST",{executar:true,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
                  if(r.success){alert(`${r.criados} item(ns) recriado(s).`);onClose();}
                  else alert("Erro: "+(r.error||"desconhecido"));
                }catch(e){alert("Erro: "+e.message);}
                finally{setSincItens(false);}
              }}
              title="Recria a lista de itens a partir dos itens de linha do pedido"
              style={{background:C.white,border:`1.5px solid ${C.green}`,borderRadius:6,padding:"7px 12px",cursor:sincItens?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.green,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{if(!sincItens)e.currentTarget.style.background=C.green+"0e";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="refresh" s={13} c={C.green}/> {sincItens?"Recriando...":"Recriar Itens"}
            </button>}
            <button
              onClick={()=>imprimirPedido(order.vendasId||order.posvendaId)}
              title="Imprimir folha de separação"
              style={{background:C.white,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"7px 12px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.gray50;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="print" s={14} c={C.gray700}/> Imprimir Pedido
            </button>
          </div>
        </div>
        {order.alertas.length>0&&<div style={{padding:"8px 20px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:`1px solid ${C.gray200}`,background:"#fffbeb",flexShrink:0}}>
          {order.alertas.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,...F.body,fontSize:12,color:"#92400e",fontWeight:600}}><Ic n="warn" s={13} c={C.amber}/>{a}</div>)}
        </div>}
        {/* Tabs */}
        <div className="sgp-scroll" style={{display:"flex",borderBottom:`1px solid ${C.gray200}`,padding:"0 20px",overflowX:"auto",gap:2,flexShrink:0}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{background:"none",border:"none",padding:"11px 12px",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?C.red:C.gray500,borderBottom:tab===t.id?`2px solid ${C.red}`:"2px solid transparent",whiteSpace:"nowrap",...F.body}}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="sgp-scroll" style={{flex:1,overflow:"auto",minHeight:0}}>
          {/* NEGÓCIO */}
          {tab==="info"&&<div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
              {[["Cliente",order.client],["CNPJ",order.cnpj],["Razão Social",order.razaoSocial],["Vendedor",order.vendedor],["Telefone",order.tel],["E-mail",order.email],["Valor",fmtR(order.valor)],["Condição de Pgto",order.condicaoPagamento],["Centro de Custo",rotuloCentroCusto(order.centroCusto)||"—"],["Tipo",order.tipo||"—"],["Tipo de Pedido",order.tipoPedido||"—"],...(order.numeroOP?[["Nº da OP",order.numeroOP]]:[]),...(order.ehOcorrencia?[["Tipo da Ocorrência",order.ocorrenciaTipo||"—"],["Parecer da Qualidade",order.ocorrenciaParecer||"Pendente"]]:[]),["Transportadora",order.transportadora||"—"],["Frete",fmtR(order.valorFrete||0)+(order.pagadorFrete?` · ${order.pagadorFrete}`:"")],["Prazo Faturamento do Pedido", _loadingDet?"⏳ Carregando...":(dataVencimento(order)?fmtVenc(dataVencimento(order))+(temDataEspecial(order)?" · DATA ESPECIAL":""):"A definir (sem amostra aprovada)")],["Emissão",fmtD(order.dataFechamento||order.entradaAt)],...(ehEtapaSobMedida(order.etapa)?[["Prazo Sob Medida",(()=>{const p=prazoSobMedida(order);return p?`${fmtD(p.data.toISOString())} · ${p.atrasado?`atrasado ${Math.abs(p.dias)} dia(s)`:p.venceHoje?"vence hoje":`faltam ${p.dias} dia(s)`}`:"emissão não informada";})()]]:[])].map(([k,v])=>(
                <div key={k} style={{background:C.gray50,borderRadius:6,padding:"10px 12px",border:`1px solid ${C.gray200}`}}>
                  <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
                  <div style={{...F.body,fontSize:13,fontWeight:600,color:_loadingDet&&(k==="Prazo Faturamento do Pedido")?C.gray400:C.black,wordBreak:"break-word",fontStyle:_loadingDet&&(k==="Prazo Faturamento do Pedido")?"italic":"normal"}}>{v}</div>
                </div>
              ))}
            </div>
            {/* SOB MEDIDA: formulário com as medidas, anexado pela vendedora.
                Fica logo abaixo dos dados do negócio porque é o documento que a
                produção precisa ter em mãos em todas as etapas do sob medida. */}
            {(order.formularioSobMedida&&order.formularioSobMedida.length>0)&&<div>
              <div style={{...F.body,fontSize:10,color:"#92400e",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Formulário Sob Medida</div>
              <ArquivosBox fileIds={order.formularioSobMedida} emptyText="Nenhum formulário anexado."/>
            </div>}
            {/* OCORRÊNCIA: relato do cliente + parecer da qualidade */}
            {order.ehOcorrencia&&(order.ocorrenciaRelato||order.ocorrenciaMotivo)&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
              {order.ocorrenciaRelato&&<div>
                <div style={{...F.body,fontSize:10,color:C.red,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Relato do cliente</div>
                <div style={{background:C.red+"08",borderRadius:6,padding:"12px 14px",...F.body,fontSize:13,color:C.gray700,lineHeight:1.6,border:`1px solid ${C.red}28`,whiteSpace:"pre-wrap"}}>{order.ocorrenciaRelato}</div>
              </div>}
              {order.ocorrenciaMotivo&&<div>
                <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Parecer da Qualidade</div>
                <div style={{background:C.gray50,borderRadius:6,padding:"12px 14px",...F.body,fontSize:13,color:C.gray700,lineHeight:1.6,border:`1px solid ${C.gray200}`,whiteSpace:"pre-wrap"}}>{order.ocorrenciaMotivo}</div>
              </div>}
            </div>}
            <div>
              <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Observações</div>
              <div style={{background:C.gray50,borderRadius:6,padding:"12px 14px",...F.body,fontSize:13,color:C.gray700,lineHeight:1.6,border:`1px solid ${C.gray200}`}}>{order.obs||"—"}</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {(()=>{
                // Se o pedido não tem bordado, a linha "AMOSTRA" não faz sentido
                // (não existe amostra pra aprovar). Mostra só SEPARAÇÃO.
                const semBordado = order.temBordado===false;
                if (_loadingDet) {
                  const arr = semBordado ? [["SEPARAÇÃO","Carregando..."]] : [["AMOSTRA","Carregando..."],["SEPARAÇÃO","Carregando..."]];
                  return arr.map(([lbl,v])=>(
                    <div key={lbl} style={{flex:1,minWidth:140,background:C.gray100,border:`1px solid ${C.gray300}`,borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                      <Ic n="clock" s={16} c={C.gray400}/>
                      <div>
                        <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lbl}</div>
                        <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:1,fontStyle:"italic"}}>{v}</div>
                      </div>
                    </div>
                  ));
                }
                const arr = semBordado
                  ? [["SEPARAÇÃO",order.sepOk,"Completa","Pendente"]]
                  : [["AMOSTRA",order.amOk,"Aprovada","Pendente"],["SEPARAÇÃO",order.sepOk,"Completa","Pendente"]];
                return arr.map(([lbl,ok,y,n])=>(
                  <div key={lbl} style={{flex:1,minWidth:140,background:ok?C.green+"12":C.amber+"12",border:`1px solid ${ok?C.green:C.amber}30`,borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                    <Ic n={ok?"check":"clock"} s={16} c={ok?C.green:C.amber}/>
                    <div>
                      <div style={{...F.body,fontSize:10,fontWeight:700,color:ok?C.green:C.amber,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lbl}</div>
                      <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:1}}>{ok?y:n}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>}
          {/* SLA */}
          {tab==="sla"&&<div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
              {[["SLA desta Etapa",sla.st,[fmtHoras(sla.hrs),`/ ${fmtHoras(sla.sla)}`],sla.st==="late"?"Etapa ultrapassou o SLA":sla.st==="risk"?"Próximo do limite":"Dentro do SLA"],
                ["Prazo Faturamento do Pedido",sla.ft==="none"?"none":sla.ft,
                  sla.htd==null?["A definir",""]:[sla.ft==="late"?`${fmtHoras(Math.abs(sla.htd))} de atraso`:`${fmtHoras(sla.htd)} restantes`,""],
                  sla.htd==null?"Sem amostra aprovada — prazo ainda não inicia":sla.ft==="late"?"Pedido fora do prazo":sla.ft==="risk"?"Prazo muito próximo":"Dentro do prazo"]
              ].map(([title,st,vals,msg])=>{
                const c=st==="late"?C.red:st==="risk"?C.amber:st==="none"?C.gray400:C.green;
                return(
                  <Card key={title} style={{borderLeft:`3px solid ${c}`}}>
                    <SecH>{title}</SecH>
                    <div style={{...F.title,fontSize:26,fontWeight:700,color:c,lineHeight:1}}>{vals[0]} <span style={{fontSize:14,fontWeight:400,color:C.gray400}}>{vals[1]}</span></div>
                    {title==="SLA desta Etapa"&&<div style={{marginTop:8}}><SLABar pct={sla.pct} st={sla.st}/></div>}
                    {title==="Prazo Faturamento do Pedido"&&dataVencimento(order)&&<div style={{...F.body,fontSize:12,color:C.gray600,marginTop:6,fontWeight:600}}>{fmtVenc(dataVencimento(order))}</div>}
                    <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:6}}>{msg}</div>
                  </Card>
                );
              })}
            </div>
            <Card>
              <SecH>Tempo por etapa</SecH>
              {(()=>{
                const hist=(order.historico&&order.historico.length>0)
                  ? order.historico
                  : (order.timeline||[]).map(t=>({stage:t.stage,who:t.user,enteredAt:t.enteredAt,exitedAt:t.exitedAt,durMin:t.dH!=null?Math.round(t.dH*60):null}));
                if(hist.length===0)return <div style={{...F.body,color:C.gray400,fontSize:13,padding:"8px 0"}}>Nenhum histórico registrado.</div>;
                return(
                <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",minWidth:560}}>
                  <thead><tr style={{borderBottom:`1px solid ${C.gray200}`}}>{["Etapa","Responsável","Entrada","Saída","Permaneceu","Status"].map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body,whiteSpace:"nowrap"}}>{hd}</th>)}</tr></thead>
                  <tbody>{hist.map((t,i)=>{
                    const act=i===hist.length-1;
                    const sl=slaCfg[t.stage];
                    const durH=t.durMin!=null?t.durMin/60:null;
                    const st=durH==null?"andamento":sl&&durH>sl?"atrasado":sl&&durH>sl*.8?"risco":"ok";
                    return(<tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                      <td style={{padding:"8px 10px",fontWeight:600,...F.body,whiteSpace:"nowrap"}}>{t.stage}</td>
                      <td style={{padding:"8px 10px",color:C.gray500,...F.body,whiteSpace:"nowrap"}}>{t.who||(t.exitedAt?"Sistema":"—")}</td>
                      <td style={{padding:"8px 10px",color:C.gray600,...F.body,fontSize:11,whiteSpace:"nowrap"}}>{fmtD(t.enteredAt)}</td>
                      <td style={{padding:"8px 10px",color:C.gray600,...F.body,fontSize:11,whiteSpace:"nowrap"}}>{t.exitedAt?fmtD(t.exitedAt):"—"}</td>
                      <td style={{padding:"8px 10px",fontWeight:700,color:st==="atrasado"?C.red:st==="risco"?C.amber:C.green,...F.body,whiteSpace:"nowrap"}}>{durH!=null?fmtDur(t.durMin):<em>Em andamento</em>}</td>
                      <td style={{padding:"8px 10px"}}><Tag label={st==="andamento"?"Andamento":st==="atrasado"?"Atrasado":st==="risco"?"Em risco":"OK"} color={st==="atrasado"?C.red:st==="risco"?C.amber:st==="andamento"?C.blue:C.green}/></td>
                    </tr>);
                  })}</tbody>
                </table>
                </div>
                );
              })()}
            </Card>
          </div>}
          {/* BORDADO */}
          {tab==="bordado"&&<div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            {/* Arquivos de bordado anexados pelo vendedor.
                Fonte: bordados_json (tem TODOS os fileIds, inclusive planilhas) +
                arquivo_do_negocio. Antes lia só arquivo_do_negocio, que às vezes
                não tinha todos os fileIds (ex.: XLSX) — e o arquivo sumia. */}
            {(()=>{
              const idsBordadoJson=(order.bordadosJson||[]).map(b=>String(b.fileId)).filter(Boolean);
              const idsNegocio=(order.arquivoBordado||[]).map(String);
              const todosIds=[...new Set([...idsBordadoJson,...idsNegocio])];
              return <div>
                <SecH>Arquivos de Bordado</SecH>
                <ArquivosBox fileIds={todosIds} emptyText="Nenhum arquivo de bordado anexado ao negócio."/>
              </div>;
            })()}
            {(order.arquivoDtfsilk&&order.arquivoDtfsilk.length>0)?<div>
              <SecH>Arquivos DTF / Silk</SecH>
              <ArquivosBox fileIds={order.arquivoDtfsilk} emptyText="Nenhum arquivo DTF/Silk."/>
            </div>:null}
            {/* Amostra digital aprovada */}
            <div>
              <div style={{display:"flex",alignItems:"center"}}>
                <SecH>Amostra Digital Aprovada</SecH>
                <SubstituirArquivoBtn bordadoId={order.bordadoId} propriedade="amostra_digital" rotulo="Amostra Digital" me={me}/>
              </div>
              <ArquivosBox fileIds={order.arqAmostraDigital?String(order.arqAmostraDigital).split(";").filter(Boolean):[]} emptyText="Nenhuma amostra digital anexada ainda."/>
            </div>
            {/* Amostra física aprovada */}
            <div>
              <div style={{display:"flex",alignItems:"center"}}>
                <SecH>Amostra Física Aprovada</SecH>
                <SubstituirArquivoBtn bordadoId={order.bordadoId} propriedade="amostra_fisica" rotulo="Amostra Física" me={me}/>
              </div>
              <ArquivosBox fileIds={order.arqAmostraFisica?String(order.arqAmostraFisica).split(";").filter(Boolean):[]} emptyText="Nenhuma amostra física anexada ainda."/>
            </div>
          </div>}
          {/* PEÇAS */}
          {tab==="itens"&&<div style={{padding:20,overflowX:"auto"}}>
            {(order.etapa==="Direcionamento")&&(
              <div style={{background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:7,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                <Ic n="arrow" s={14} c={C.blue}/>
                <span style={{...F.body,fontSize:12,color:C.blue,fontWeight:600}}>Para definir Interno/Externo, use a aba <strong>▶ Executar</strong></span>
              </div>
            )}
            {podeEditarSep && (
              <div style={{background:"#eff6ff",border:`1.5px solid ${C.blue}44`,borderLeft:`5px solid ${C.blue}`,borderRadius:8,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <div style={{...F.body,fontSize:12,color:C.gray700,lineHeight:1.5,flex:1,minWidth:220}}>
                  <strong style={{color:C.blue}}>Corrigir separação:</strong> edite a coluna <strong>Qtd Separada</strong> e salve. Grava direto no HubSpot (Pedidos Aprovados). Disponível só em <strong>Em Separação</strong> e <strong>Conferência Separação</strong>.
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {sepMsg && <span style={{...F.body,fontSize:12,fontWeight:600,color:sepMsg.startsWith("Erro")?C.red:sepMsg.startsWith("Nenhuma")?C.gray500:C.green}}>{sepMsg}</span>}
                  <button onClick={()=>{const n={...sepEdits};for(const it of (order.items||[])){if(!it.naoSeparavel&&it.id)n[it.id]=String(Number(it.qty||0));}setSepEdits(n);setSepMsg("Tudo marcado como separado — clique em Salvar quantidades.");}} disabled={savingSep}
                    style={{background:"#fff",color:C.green,border:`1.5px solid ${C.green}`,borderRadius:7,padding:"10px 14px",cursor:savingSep?"wait":"pointer",...F.body,fontWeight:700,fontSize:13,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:6}}>
                    <Ic n="check" s={14} c={C.green}/> Marcar tudo como separado
                  </button>
                  <button onClick={salvarSeparacao} disabled={savingSep}
                    style={{background:savingSep?"#ccc":C.blue,color:C.white,border:"none",borderRadius:7,padding:"10px 18px",cursor:savingSep?"wait":"pointer",...F.body,fontWeight:700,fontSize:13,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:6}}>
                    <Ic n="check" s={14} c={C.white}/> {savingSep?"Salvando...":"Salvar quantidades"}
                  </button>
                </div>
              </div>
            )}
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:560}}>
              <thead><tr style={{borderBottom:`2px solid ${C.gray200}`}}>
                {["SKU","Descrição","TAM","Qtd","Qtd Separada","Saldo","Bordado","Destino","Status"].map(hd=><th key={hd} style={{padding:"9px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body,textTransform:"uppercase",letterSpacing:"0.05em"}}>{hd}</th>)}
              </tr></thead>
              <tbody>{order.items.map((it,i)=>{
                const qtd=Number(it.qty||0);
                const qtdSepOrig=Number(it.qtdSeparada!=null?it.qtdSeparada:0);
                const editandoSep = podeEditarSep && !it.naoSeparavel;
                // Valor exibido: se está editando e tem edição pendente, usa ela
                // (preview ao vivo de saldo/status). Senão, o valor original.
                const qtdSep = (editandoSep && (it.id in sepEdits)) ? (Number(sepEdits[it.id])||0) : qtdSepOrig;
                const saldo=Math.max(0,qtd-qtdSep);
                const stSep=it.naoSeparavel
                  ? (it.statusSeparacao||"personalizacao")
                  : (qtdSep===0?"pendente":(qtdSep<qtd?"parcial":"completa"));
                const corSep=it.naoSeparavel?C.purple:(stSep==="completa"?C.green:stSep==="parcial"?C.amber:C.red);
                return(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`,background:it.naoSeparavel?"#faf5ff":"transparent"}}>
                  <td style={{padding:"9px 10px",fontWeight:700,fontFamily:"monospace",fontSize:12,color:C.gray700,verticalAlign:"top"}}>{it.sku}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray700,verticalAlign:"top"}}>
                    <div>{it.desc}</div>
                    {it.descricao&&<div style={{
                      marginTop:4,fontSize:11,fontWeight:600,color:"#92400e",
                      background:"#fef3c7",borderLeft:`3px solid #fcd34d`,
                      borderRadius:3,padding:"4px 7px",lineHeight:1.4,
                      whiteSpace:"pre-wrap",wordBreak:"break-word"
                    }}>
                      <strong>📝 Obs vendedor:</strong> {it.descricao}
                    </div>}
                  </td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray500,verticalAlign:"top"}}>{it.cor}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body,verticalAlign:"top"}}>{qtd}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body,color:it.naoSeparavel?C.gray400:corSep,verticalAlign:"top"}}>
                    {it.naoSeparavel ? "—" : (editandoSep ? (
                      <input type="number" min="0"
                        value={it.id in sepEdits ? sepEdits[it.id] : String(qtdSepOrig)}
                        onChange={e=>setSepEdits(p=>({...p,[it.id]:e.target.value}))}
                        style={{width:60,padding:"5px 6px",border:`1.5px solid ${C.gray300}`,borderRadius:6,fontSize:13,...F.body,textAlign:"center"}}/>
                    ) : qtdSep)}
                  </td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body,color:it.naoSeparavel?C.gray400:(saldo>0?C.red:C.gray400),verticalAlign:"top"}}>{it.naoSeparavel?"—":(saldo>0?saldo:"—")}</td>
                  <td style={{padding:"9px 10px",verticalAlign:"top"}}>{it.bordado?<Tag label="Bordado" color={C.red}/>:<span style={{color:C.gray400}}>—</span>}</td>
                  <td style={{padding:"9px 10px",verticalAlign:"top"}}>{it.dest?<Tag label={it.dest==="interno"?"Interno":"Externo"} color={it.dest==="interno"?C.green:C.purple}/>:<span style={{color:C.gray400}}>—</span>}</td>
                  <td style={{padding:"9px 10px",verticalAlign:"top"}}><Tag label={
                    it.naoSeparavel ? "Personalização"
                    : stSep==="completa" ? "Separado"
                    : stSep==="parcial" ? `Parcial (${qtdSep}/${qtd})`
                    : "Pendente"
                  } color={corSep}/></td>
                </tr>
                );
              })}</tbody>
              <tfoot><tr style={{borderTop:`2px solid ${C.gray200}`,background:C.gray50}}>
                <td colSpan={3} style={{padding:"9px 10px",fontWeight:700,fontSize:11,...F.body,color:C.gray500,textTransform:"uppercase"}}>Total</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body}}>{total}</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body,color:C.green}}>{order.items.filter(i=>!i.naoSeparavel).reduce((s,i)=>s+((podeEditarSep&&(i.id in sepEdits))?(Number(sepEdits[i.id])||0):Number(i.qtdSeparada||0)),0)}</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body,color:C.red}}>{order.items.filter(i=>!i.naoSeparavel).reduce((s,i)=>{const qs=(podeEditarSep&&(i.id in sepEdits))?(Number(sepEdits[i.id])||0):Number(i.qtdSeparada||0);return s+Math.max(0,Number(i.qty||0)-qs);},0)||"—"}</td>
                <td colSpan={3}/>
              </tr></tfoot>
            </table>
          </div>}
          {tab==="tl"&&<Timeline order={order}/>}
          {tab==="alteracao"&&<AlteracaoFormTab order={order} onAction={onAction} me={me}/>}
          {tab==="chat"&&<div style={{height:isMobile?380:420}}><Chat order={order} me={me} usuarios={usuarios}/></div>}
          {tab==="acao"&&<AcaoTab
            order={order} me={me}
            uploadFiles={uploadFiles} setUploadFiles={setUploadFiles}
            obsText={obsText} setObsText={setObsText}
            actionDone={actionDone} setActionDone={setActionDone}
            actionMsg={actionMsg} setActionMsg={setActionMsg}
            itemSel={itemSel} itemDest={itemDest} nSel={nSel}
            allDestDefined={allDestDefined} skus={skus} itensDirecionaveis={itensDirecionaveis}
            toggleItemSel={toggleItemSel} selAllItems={selAllItems}
            setDestSel={setDestSel} setDestAll={setDestAll} setDestOne={setDestOne}
            onAction={onAction} isMobile={isMobile}
            loadingDet={_loadingDet}
            setTemPendencias={setTemPendencias}
          />}
        </div>
      </div>
      {/* Modal de motivo — Pendência Comercial */}
      {modalPend&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1002,padding:20}} onClick={()=>setModalPend(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,padding:24,maxWidth:500,width:"100%",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
          <div style={{...F.title,fontSize:16,fontWeight:800,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
            <Ic n="clock" s={18} c="#92400e"/> Enviar para Pendência Comercial
          </div>
          <div style={{...F.body,fontSize:13,color:C.gray600,marginBottom:16,lineHeight:1.5}}>
            O pedido sai da etapa <strong>{order.etapa}</strong> e vai pra aba "Pendência Comercial". O tempo aqui é contado como retrabalho comercial. Quando o vendedor resolver, o pós-venda dá "OK" e o pedido volta pra esta etapa automaticamente.
          </div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Motivo (obrigatório)</label>
          <textarea value={motivoPend} onChange={e=>setMotivoPend(e.target.value)} rows={4}
            placeholder="Ex: vendedor precisa validar tamanho com o cliente; aguardando aprovação de amostra alternativa; cliente pediu alteração de forma de pagamento..."
            style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",resize:"vertical",marginBottom:14}}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={()=>{setModalPend(false);setMotivoPend("");}} style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 14px",...F.body,fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
            <button onClick={async()=>{
              if(!motivoPend.trim()){alert("Motivo obrigatório."); return;}
              try{
                const r=await apiFetch("/pendencia-comercial/entrar","POST",{
                  dealId: order.posvendaId || order.bordadoId,
                  motivo: motivoPend.trim(),
                  ctx: { executor: me?.nome || "Usuário SGP" },
                });
                if(r.success){
                  setModalPend(false); setMotivoPend("");
                  onClose();
                }else alert("Erro: "+(r.error||"desconhecido"));
              }catch(e){alert("Erro: "+e.message);}
            }} style={{background:C.amber,color:C.white,border:"none",borderRadius:6,padding:"9px 16px",...F.body,fontSize:13,fontWeight:700,cursor:"pointer"}}>
              Confirmar envio
            </button>
          </div>
        </div>
      </div>}
      {/* Modal — Gerar Bordado (admin): com amostra (Programação) ou sem (Liberado) */}
      {modalGerar&&(()=>{
        // forcar=true só é enviado depois que o usuário confirma o aviso do worker
        // (pedido que pede programação sendo gerado "sem amostra").
        const gerar=async(semAmostra,forcar=false)=>{
          setGerandoBordado(true);
          try{
            const r=await apiFetch(`/gerar-bordado/${order.vendasId}`,"POST",{semAmostra,forcar,ctx:{executor:me?.nome||me?.email||"Usuário SGP"}});
            if(r.success){ setModalGerar(false); alert(`Bordado gerado ${r.semAmostra?"pronto para direcionar (sem amostra)":"em Programação"} — ${r.programacoes} arquivo(s)${typeof r.itensMarcados==="number"?`, ${r.itensMarcados} item(ns) marcado(s) como bordado`:""}.`); onClose(); }
            else alert("Erro: "+(r.error||"desconhecido"));
          }catch(e){
            // 409 com precisaConfirmar: o pedido pede programação e o usuário
            // escolheu "sem amostra". Só segue se ele confirmar explicitamente.
            if(e.corpo&&e.corpo.precisaConfirmar&&!forcar){
              setGerandoBordado(false);
              if(confirm(`⚠ ATENÇÃO\n\n${e.message}\n\nQuer mesmo gerar SEM amostra, ignorando a exigência de programação?`)){
                await gerar(semAmostra,true);
              }
              return;
            }
            alert("Erro: "+e.message);
          }
          finally{setGerandoBordado(false);}
        };
        return (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1002,padding:20}} onClick={()=>!gerandoBordado&&setModalGerar(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,padding:24,maxWidth:540,width:"100%",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
            <div style={{...F.title,fontSize:16,fontWeight:800,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              <Ic n="needle" s={18} c={C.purple}/> Gerar Bordado
            </div>
            <div style={{...F.body,fontSize:13,color:C.gray600,marginBottom:16,lineHeight:1.5}}>
              Este pedido tem arquivos de bordado mas não entrou no fluxo de bordado. Escolha como gerar — os itens com bordado também serão marcados automaticamente.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button disabled={gerandoBordado} onClick={()=>gerar(false)}
                style={{textAlign:"left",background:C.white,border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"12px 14px",cursor:gerandoBordado?"wait":"pointer"}}
                onMouseEnter={e=>{if(!gerandoBordado)e.currentTarget.style.borderColor=C.purple;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.gray200;}}>
                <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black}}>Precisa de amostra → Programação</div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:2}}>Fluxo completo: vai pra Programação, depois amostra digital/física, aprovação e então liberado pra bordar.</div>
              </button>
              <button disabled={gerandoBordado} onClick={()=>gerar(true)}
                style={{textAlign:"left",background:C.white,border:`1.5px solid ${C.purple}`,borderRadius:8,padding:"12px 14px",cursor:gerandoBordado?"wait":"pointer"}}
                onMouseEnter={e=>{if(!gerandoBordado)e.currentTarget.style.background=C.purple+"0a";}} onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
                <div style={{...F.body,fontSize:13,fontWeight:700,color:C.purple}}>Sem amostra → Pronto pra direcionar</div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:2}}>Já cria em "Liberado para bordar". Os itens aparecem em "Itens para bordar" na hora e podem ser direcionados (Interno/Externo), sem passar por programação/amostra.</div>
              </button>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
              <button disabled={gerandoBordado} onClick={()=>setModalGerar(false)} style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 14px",...F.body,fontSize:13,fontWeight:600,cursor:gerandoBordado?"wait":"pointer"}}>{gerandoBordado?"Gerando...":"Cancelar"}</button>
            </div>
          </div>
        </div>);
      })()}
      {/* Modal — Voltar Etapa (permissão voltar_etapa) */}
      {modalVoltar&&(()=>{
        const idxAtual=idxFunil(order.etapa);
        // Etapas que pertencem ao funil de BORDADO: escolher uma delas move
        // SOMENTE o negócio de Bordado (o pedido/pós-venda só é ajustado se
        // estiver adiante). As demais movem o negócio de Pós-Venda.
        const bordadoStages=new Set(["Programação","Amostra Digital","Aprovação de Amostra Digital","Amostra Física","Aprovação de Amostra Física","Liberado para Bordar","Bordado Interno","Bordado Externo","Bordado Interno e Externo"]);
        // Qualquer etapa diferente da atual (anterior OU posterior). Sem bordado
        // → oculta etapas de bordado.
        const opcoes=FUNIL_ORDEM.filter((e,i)=> (idxAtual<0? true : i!==idxAtual) && !(order.temBordado===false&&bordadoStages.has(e)));
        return(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1002,padding:20}} onClick={()=>!voltando&&setModalVoltar(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,padding:24,maxWidth:520,width:"100%",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
            <div style={{...F.title,fontSize:16,fontWeight:800,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              <Ic n="arrow" s={18} c="#92400e"/> Alterar Etapa do Pedido
            </div>
            <div style={{...F.body,fontSize:13,color:C.gray600,marginBottom:16,lineHeight:1.5}}>
              O pedido está em <strong>{order.etapa}</strong>. Escolha para qual etapa ele deve ir — pode ser <strong>anterior</strong> (voltar) ou <strong>posterior</strong> (avançar). A ação fica registrada na timeline do pedido com o motivo.
            </div>
            {opcoes.length===0
              ?<div style={{...F.body,fontSize:13,color:C.gray500,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:14,marginBottom:14}}>Não há outra etapa disponível para este pedido.</div>
              :<>
                <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Nova etapa (obrigatório)</label>
                <select value={etapaVoltarSel} onChange={e=>setEtapaVoltarSel(e.target.value)}
                  style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",marginBottom:14,background:C.white}}>
                  <option value="">— selecione a etapa —</option>
                  {opcoes.map(e=>{const i=FUNIL_ORDEM.indexOf(e);const dir=idxAtual<0?"":i<idxAtual?"← voltar · ":"→ avançar · ";const alvo=bordadoStages.has(e)?" [só o bordado]":" [pedido]";return <option key={e} value={e}>{dir}{e}{alvo}</option>;})}
                </select>
                <div style={{...F.body,fontSize:11.5,color:C.gray500,marginTop:-8,marginBottom:14,lineHeight:1.5}}>
                  <strong>[só o bordado]</strong> move apenas o negócio de Bordado — o pedido só é ajustado se estiver adiante da fase de bordado. <strong>[pedido]</strong> move o pós-venda.
                </div>
                <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Motivo (obrigatório)</label>
                <textarea value={motivoVoltar} onChange={e=>setMotivoVoltar(e.target.value)} rows={3}
                  placeholder="Ex: amostra reprovada, precisa refazer; pulou etapa por engano; adiantar por urgência do cliente..."
                  style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",resize:"vertical",marginBottom:14}}/>
              </>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button disabled={voltando} onClick={()=>{setModalVoltar(false);setEtapaVoltarSel("");setMotivoVoltar("");}} style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 14px",...F.body,fontSize:13,fontWeight:600,cursor:voltando?"wait":"pointer"}}>Cancelar</button>
              {opcoes.length>0&&<button disabled={voltando} onClick={async()=>{
                if(!etapaVoltarSel){alert("Selecione a etapa de destino.");return;}
                if(!motivoVoltar.trim()){alert("Motivo obrigatório.");return;}
                if(!confirm(`Mover o pedido para "${etapaVoltarSel}"?`))return;
                setVoltando(true);
                try{
                  const r=await apiFetch(`/voltar-etapa/${order.vendasId}`,"POST",{
                    posvendaId:order.posvendaId||"",
                    bordadoId:order.bordadoId||"",
                    etapaDestino:etapaVoltarSel,
                    motivo:motivoVoltar.trim(),
                    ctx:{executor:me?.nome||me?.email||"Usuário SGP",vendasId:order.vendasId,posvendaId:order.posvendaId,bordadoId:order.bordadoId},
                  });
                  if(r.success){ setModalVoltar(false);setEtapaVoltarSel("");setMotivoVoltar(""); onClose(); }
                  else alert("Erro: "+(r.error||"desconhecido"));
                }catch(e){alert("Erro: "+e.message);}
                finally{setVoltando(false);}
              }} style={{background:voltando?C.gray300:C.amber,color:C.white,border:"none",borderRadius:6,padding:"9px 16px",...F.body,fontSize:13,fontWeight:700,cursor:voltando?"wait":"pointer"}}>
                {voltando?"Alterando...":"Confirmar alteração"}
              </button>}
            </div>
          </div>
        </div>);
      })()}
      {/* Modal de motivo — Aguardando Outro Pedido */}
      {modalAguard&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1002,padding:20}} onClick={()=>setModalAguard(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,padding:24,maxWidth:500,width:"100%",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
          <div style={{...F.title,fontSize:16,fontWeight:800,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
            <Ic n="clock" s={18} c={C.blue}/> Aguardando Outro Pedido
          </div>
          <div style={{...F.body,fontSize:13,color:C.gray600,marginBottom:16,lineHeight:1.5}}>
            O pedido sai da etapa <strong>{order.etapa}</strong> e vai pra aba "Aguardando Outro Pedido". Use quando o vendedor pediu pra faturar junto com outro pedido ou aguardar material atrelado.
          </div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Pedido que vai ser aguardado (obrigatório)</label>
          {pedidoDepSel
            ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,border:`1.5px solid ${C.blue}`,background:C.blue+"0c",borderRadius:6,padding:"9px 12px",marginBottom:12}}>
                <span style={{...F.body,fontSize:13,color:C.gray800,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}><strong>{idPedido(pedidoDepSel)}</strong>{pedidoDepSel.client?` · ${pedidoDepSel.client}`:""}</span>
                <button onClick={()=>{setPedidoDepSel(null);setPedidoDep("");setPedidoDepBusca("");}} style={{background:"none",border:"none",color:C.gray500,cursor:"pointer",fontSize:14,flexShrink:0}}>✕ trocar</button>
              </div>
            : <div style={{position:"relative",marginBottom:12}}>
                <input value={pedidoDepBusca} onChange={e=>setPedidoDepBusca(e.target.value)} placeholder="Buscar por cliente, nº Linx ou ID..."
                  style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",outline:"none",boxSizing:"border-box"}}/>
                {pedidoDepBusca.trim().length>=2&&(()=>{
                  const q=pedidoDepBusca.trim().toLowerCase();
                  const todos=snapTodosPedidos(_snapDep.data).filter(p=>String(p.vendasId||"")!==String(order.vendasId||""));
                  const matches=todos.filter(p=>((p.client||"")+" "+(p.pedidoLinx||"")+" "+(p.vendasId||"")).toLowerCase().includes(q)).slice(0,8);
                  return <div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:2,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:5,maxHeight:220,overflowY:"auto"}}>
                    {matches.length?matches.map((p,i)=>(
                      <div key={p.vendasId||i} onClick={()=>{setPedidoDepSel(p);setPedidoDep(String(p.vendasId||""));setPedidoDepBusca("");}}
                        style={{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${C.gray50}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{...F.body,fontSize:12.5,fontWeight:700,color:C.gray800}}>{idPedido(p)}</div>
                        <div style={{...F.body,fontSize:11,color:C.gray500}}>{p.client} · {p.etapa}</div>
                      </div>
                    )):<div style={{padding:"10px 12px",...F.body,fontSize:12,color:C.gray400}}>Nenhum pedido ativo encontrado.</div>}
                  </div>;
                })()}
              </div>}
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Motivo (obrigatório)</label>
          <textarea value={motivoAguard} onChange={e=>setMotivoAguard(e.target.value)} rows={4}
            placeholder="Ex: aguardar faturamento junto com o pedido X; aguardar chegada de material do pedido Y..."
            style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",resize:"vertical",marginBottom:14}}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={()=>{setModalAguard(false);setMotivoAguard("");setPedidoDep("");setPedidoDepSel(null);setPedidoDepBusca("");}} style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 14px",...F.body,fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
            <button onClick={async()=>{
              if(!pedidoDep.trim()){alert("Selecione o pedido que vai ser aguardado."); return;}
              if(!motivoAguard.trim()){alert("Motivo obrigatório."); return;}
              try{
                const r=await apiFetch("/aguardando-outro-pedido/entrar","POST",{
                  dealId: order.posvendaId || order.bordadoId,
                  pedidoDependencia: pedidoDep.trim(),
                  motivo: motivoAguard.trim(),
                  ctx: { executor: me?.nome || "Usuário SGP" },
                });
                if(r.success){ setModalAguard(false); setMotivoAguard(""); setPedidoDep(""); setPedidoDepSel(null); setPedidoDepBusca(""); onClose(); }
                else alert("Erro: "+(r.error||"desconhecido"));
              }catch(e){alert("Erro: "+e.message);}
            }} style={{background:C.blue,color:C.white,border:"none",borderRadius:6,padding:"9px 16px",...F.body,fontSize:13,fontWeight:700,cursor:"pointer"}}>
              Confirmar
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
// Centro de custo: no HubSpot a opção "27" é gravada só com o número (as demais
// já vêm com a descrição). Traduz pro rótulo completo — ex.: "27" → "27 - Corporativo".
const CENTRO_CUSTO_LABEL = {
  "27": "27 - Corporativo",
  "10": "10 - Concessionária",
  "31": "31 - B2B",
  "03": "03 - Licitação",
  "3":  "03 - Licitação",
  "29": "29 - Comercial Diretoria",
};
const rotuloCentroCusto = (cc) => {
  const v = String(cc||"").trim();
  if(!v) return "";
  return CENTRO_CUSTO_LABEL[v] || v;   // já veio com descrição → mantém
};

// Badge do CENTRO DE CUSTO (Corporativo / Concessionária / B2B / Licitação...).
// Mostra código + descrição (ex.: "27 - CORPORATIVO"), com cor por tipo.
function TagCentroCusto({cc,size="md"}){
  const v=rotuloCentroCusto(cc);
  if(!v) return null;
  const s=v.toLowerCase();
  let cor,bg,bd,label=v.toUpperCase();
  if(/concession/.test(s))      { cor="#4b2673"; bg="#efe8f7"; bd="#7c4bb8"; }
  else if(/licita|pregao|pregão|governo|publico|público/.test(s)) { cor="#7a2a06"; bg="#fce8d5"; bd="#c46a2f"; }
  else if(/b2b|revend|distribu/.test(s)) { cor="#0e4f6e"; bg="#e2f1f8"; bd="#3a86ad"; }
  else if(/corporat|empresa/.test(s)) { cor="#0d4d24"; bg="#e8f5ec"; bd="#4a8f5f"; }
  else if(/diretoria|comercial/.test(s)) { cor="#8a4b00"; bg="#fdf0dd"; bd="#c98b2e"; }
  else if(/varejo|loja|b2c|consumidor/.test(s)) { cor="#8a4b00"; bg="#fdf0dd"; bd="#c98b2e"; }
  else { cor=C.gray600; bg=C.gray100; bd=C.gray300; }
  const sm=size==="sm";
  return (
    <span title={"Centro de custo: "+v}
      style={{...F.title,display:"inline-flex",alignItems:"center",flexShrink:0,
        fontSize:sm?9:10,fontWeight:800,letterSpacing:"0.05em",
        padding:sm?"2px 7px":"3px 9px",borderRadius:6,
        background:bg,color:cor,border:`1px solid ${bd}`,whiteSpace:"nowrap"}}>
      {label}
    </span>
  );
}

// Badge do TIPO do negócio (marca/segmento: JEEP, FIAT, VAREJO, LICITAÇÃO...).
// Fica ao lado do centro de custo — juntos dizem "de onde vem" o pedido.
function TagTipo({tipo,size="md"}){
  const v=String(tipo||"").trim();
  if(!v) return null;
  const sm=size==="sm";
  return (
    <span title={"Tipo: "+v}
      style={{...F.title,display:"inline-flex",alignItems:"center",flexShrink:0,
        fontSize:sm?9:10,fontWeight:800,letterSpacing:"0.05em",
        padding:sm?"2px 7px":"3px 9px",borderRadius:6,
        background:C.gray100,color:C.gray700,border:`1px solid ${C.gray300}`,whiteSpace:"nowrap"}}>
      {v.toUpperCase()}
    </span>
  );
}

function OCard({order,onClick,slaCfg}){
  const total=pecasDoCard(order);
  const falt=order.items.filter(i=>i.status==="faltante").reduce((s,i)=>s+i.qty,0);
  const sla=getSLA(order,slaCfg);
  const venc=sla.venc;
  const vencido=sla.ft==="late";
  const risco=sla.ft==="risk";
  // Cor da data limite: vermelho vencido, âmbar <24h, cinza ok, cinza claro indefinido
  const corLimite=!venc?C.gray400:vencido?C.red:risco?C.amber:C.gray600;
  const accent=vencido?C.red:risco?C.amber:STAGE_COLOR[order.etapa]||C.gray300;
  // Cards de Programação são feitos por programadora externa — ocultar dados
  // comerciais (valor, quantidade de peças, data limite). Só mostra ID, cliente e SLA.
  const ehProg = order.etapa === "Programação";
  return(
    <div onClick={onClick} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:14,cursor:"pointer",borderLeft:`3px solid ${accent}`}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:8}}>
        <div style={{minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{idPedido(order)}</span>
            <TagCentroCusto cc={order.centroCusto} size="sm"/>
            <TagTipo tipo={order.tipo} size="sm"/>
          </div>
          <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{order.client}</div>
        </div>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
          <ETag etapa={order.etapa}/><TagDataEspecial o={order}/>
          {order.subEtapa&&<span style={{...F.title,fontSize:9,fontWeight:700,letterSpacing:"0.04em",padding:"2px 6px",borderRadius:4,background:order.subEtapa==="Aguardando peça"?C.amber+"18":C.gray100,color:order.subEtapa==="Aguardando peça"?"#92400e":C.gray600,border:`1px solid ${order.subEtapa==="Aguardando peça"?C.amber+"55":C.gray200}`,whiteSpace:"nowrap"}}>{order.subEtapa==="Aguardando peça"?"⏳ ":""}{order.subEtapa}</span>}
        </div>
      </div>
      {!ehProg&&<div style={{display:"flex",gap:12,...F.body,fontSize:12,color:C.gray500,flexWrap:"wrap",marginBottom:8}}>
        <span style={{fontWeight:700,color:C.green}}>{fmtR(order.valor)}</span>
        <span>{total} peças</span>
        {falt>0&&<span style={{color:C.red,fontWeight:600}}>{falt} faltantes</span>}
        {order.temBordado===false&&<span style={{color:C.gray500,fontWeight:600}}>Sem bordado</span>}
      </div>}
      {/* DATA LIMITE em destaque (não mostrada em Programação) */}
      {!ehProg&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 9px",borderRadius:6,marginBottom:8,
        background:!venc?C.gray100:vencido?C.red+"12":risco?C.amber+"14":C.gray100,
        border:`1px solid ${!venc?C.gray200:vencido?C.red+"35":risco?C.amber+"40":C.gray200}`}}>
        <Ic n="clock" s={13} c={corLimite}/>
        <span style={{...F.body,fontSize:11.5,fontWeight:700,color:corLimite}}>
          {!venc?(order.temBordado===false?"⏳ Calculando prazo...":"Aguardando aprovação de amostra"):vencido?`Vencido em ${fmtVenc(venc,true)}`:`Vence em ${fmtVenc(venc,true)}`}
        </span>
      </div>}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <SLABar pct={sla.pct} st={sla.st}/>
        {!ehProg&&<span title={order.slaDesdeAprovacaoAmostra?"O pedido foi separado antes da amostra ficar pronta. O relógio conta a partir da aprovação do bordado.":undefined}
          style={{...F.body,fontSize:10,color:sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.green,fontWeight:700,flexShrink:0,display:"inline-flex",alignItems:"center",gap:3}}>
          {order.slaDesdeAprovacaoAmostra&&<Ic n="needle" s={9} c={C.gray400}/>}
          {sla.hrs.toFixed(0)}h/{sla.sla}h
        </span>}
        <button
          onClick={(e)=>{e.stopPropagation();imprimirPedido(order.vendasId||order.posvendaId);}}
          title="Imprimir folha de separação"
          style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:5,padding:"4px 7px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,color:C.gray600,flexShrink:0}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.gray50;e.currentTarget.style.borderColor=C.gray300;}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.borderColor=C.gray200;}}>
          <Ic n="print" s={13} c={C.gray600}/>
          <span style={{...F.body,fontSize:10.5,fontWeight:700}}>Imprimir</span>
        </button>
      </div>
    </div>
  );
}

// ─── MINHAS DEMANDAS ─────────────────────────────────────────────────────────
function MinhasDemandas({user,onOpen,slaCfg}){
  // Módulos de operação que o usuário tem acesso (com endpoint)
  const modulos=(user.admin
    ? Object.keys(MODULO_ENDPOINT)
    : (user.modulos||[]).filter(m=>MODULO_ENDPOINT[m]));

  const [filtro,setFiltro]=useState("todos"); // "todos" ou nome da etapa

  // Fonte única: filtra o snapshot pelas etapas que o usuário tem acesso
  const snap = useSnapshotAberto();
  const loading = snap.loading && !snap.data;
  const erro = snap.error;
  const carregar = snap.refresh;
  const dados = useMemo(() => {
    const obj = {};
    const todos = snapTodosPedidos(snap.data).map(o => normalizarCard(o, o.etapa));
    for (const m of modulos) {
      const etapa = MODULO_ETAPA[m];
      // Card entra na etapa se ela está em suas etapasAtivas (múltiplas etapas
      // possíveis por card — ex.: separação + programação simultaneamente).
      // Array vazio [] é truthy — trata como fallback pra evitar sumir cards.
      obj[etapa] = ordenarPorPrioridade(
        todos.filter(o => {
          const ativas = (o.etapasAtivas && o.etapasAtivas.length) ? o.etapasAtivas : [o.etapa];
          return ativas.includes(etapa);
        })
      );
    }
    return obj;
  }, [snap.data, modulos.join(",")]);

  const etapas=modulos.map(m=>MODULO_ETAPA[m]).filter(Boolean);
  const etapasComDados=etapas.filter(e=>dados&&(dados[e]||[]).length>0);
  const etapasMostrar=filtro==="todos"?etapasComDados:etapasComDados.filter(e=>e===filtro);
  // Contagem única por vendasId (card pode estar em várias etapas)
  const idsUnicos=new Set();
  etapas.forEach(e=>((dados&&dados[e])||[]).forEach(o=>idsUnicos.add(o.vendasId||o.id)));
  const total=idsUnicos.size;
  const agora=Date.now();
  const idsAtrasados=new Set();
  etapas.forEach(e=>((dados&&dados[e])||[]).forEach(o=>{
    if(venceuAntes(o.dataVencimento,agora)) idsAtrasados.add(o.vendasId||o.id);
  }));
  const atrasados=idsAtrasados.size;

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <PageH title="Minhas Demandas" sub={`${total} pedido${total!==1?"s":""} sob sua responsabilidade`} onRefresh={carregar} refreshing={loading}/>
      <SnapStatus snap={snap}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="Em andamento" value={total} icon="list"/>
        {atrasados>0&&<Stat label="Atrasados" value={atrasados} color={C.red} icon="warn"/>}
      </div>

      {/* Filtro por tipo de demanda */}
      {etapas.length>1&&<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        <button onClick={()=>setFiltro("todos")}
          style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:7,border:`1.5px solid ${filtro==="todos"?C.red:C.gray200}`,background:filtro==="todos"?C.red+"0e":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:filtro==="todos"?700:500,color:filtro==="todos"?C.red:C.gray600,whiteSpace:"nowrap"}}>
          Todos <span style={{background:filtro==="todos"?C.red:C.gray200,color:filtro==="todos"?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{total}</span>
        </button>
        {etapas.map(e=>{
          const n=((dados&&dados[e])||[]).length;
          const ativo=filtro===e;
          return(
            <button key={e} onClick={()=>setFiltro(e)}
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:7,border:`1.5px solid ${ativo?(STAGE_COLOR[e]||C.red):C.gray200}`,background:ativo?(STAGE_COLOR[e]||C.red)+"12":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:ativo?700:500,color:ativo?(STAGE_COLOR[e]||C.red):C.gray600,whiteSpace:"nowrap"}}>
              {e} <span style={{background:ativo?(STAGE_COLOR[e]||C.red):C.gray200,color:ativo?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{n}</span>
            </button>
          );
        })}
      </div>}

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>Carregando do HubSpot...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {erro}</div>}

      {!loading&&etapasMostrar.length===0&&(
        <div style={{textAlign:"center",padding:60,...F.body,color:C.gray400,fontSize:14,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          <Ic n="check" s={36} c={C.gray300} style={{margin:"0 auto 12px",display:"block"}}/>
          Nenhuma demanda pendente no momento.
        </div>
      )}

      {etapasMostrar.map(etapa=>(
        <div key={etapa}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLOR[etapa]||C.gray400,flexShrink:0}}/>
            <span style={{...F.title,fontSize:12,fontWeight:700,letterSpacing:"0.08em"}}>{etapa.toUpperCase()}</span>
            <span style={{...F.body,fontSize:12,color:C.gray400}}>({dados[etapa].length})</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {dados[etapa].map(o=><OCard key={(o.id||"")+etapa} order={o} onClick={()=>onOpen({...o,_etapaOrigem:etapa})} slaCfg={slaCfg}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DIRECIONAMENTO (COMPLETO) ────────────────────────────────────────────────
// ─── CONFERÊNCIA SEPARAÇÃO ──────────────────────────────────────────────────
// Fila dos pedidos que o WMS bipou (parcial ou completo). O conferidor precisa
// confirmar manualmente clicando no botão "Conferido". A ação decide:
//   - Sem bordado → move direto para Expedição
//   - Com bordado → move para Conferência e Direcionamento
// ─── MÓDULO ANÁLISE PCP ───────────────────────────────────────────────────
// Componente genérico das 3 caixas do PCP:
//  - Análise PCP  → roteia o pedido parcial pra loja ou produção (2 botões)
//  - Buscar em Loja / Análise Produção → botão "Concluído" (volta pra Retirar
//    e Conferir).
// `acoes` = [{label, cor, icon, apiPath, body, confirmMsg}].
// Tabela de PEÇAS FALTANTES agregada por (código + descrição + tamanho) de TODOS
// os pedidos da etapa PCP. Exportável (CSV) e expansível: ao clicar na linha,
// mostra de quais pedidos aquela peça falta e a quantidade em cada um.
function TabelaFaltantes({ pedidos, etapaLabel }) {
  const [aberta, setAberta] = useState(null);
  const { linhas, totalFalta } = useMemo(() => {
    const map = new Map();
    for (const o of (pedidos || [])) {
      for (const it of (o.items || [])) {
        if (it.naoSeparavel) continue;
        const falta = Number(it.saldoSeparacao || 0);
        if (falta <= 0) continue;
        const sku = String(it.sku || "").trim();
        const desc = String(it.desc || "").trim();
        const tam = String(it.cor || "").trim();
        const key = sku + "|" + desc + "|" + tam;
        if (!map.has(key)) map.set(key, { key, sku, desc, tam, falta: 0, pedidos: [] });
        const l = map.get(key);
        l.falta += falta;
        l.pedidos.push({ id: o.id, pedidoLinx: o.pedidoLinx, client: o.client, etapa: o.etapa || "", falta });
      }
    }
    const linhas = [...map.values()].sort((a, b) => b.falta - a.falta);
    return { linhas, totalFalta: linhas.reduce((s, l) => s + l.falta, 0) };
  }, [pedidos]);

  const exportarCSV = () => {
    const esc = (c) => `"${String(c == null ? "" : c).replace(/"/g, '""')}"`;
    const rows = [["Codigo", "Descricao", "Tamanho", "Qtd Faltante", "Pedidos"].map(esc).join(";")];
    for (const l of linhas) {
      const peds = l.pedidos
        .map(p => `${String(p.id).replace(/^PED-/, "")}${p.pedidoLinx ? " (PED " + p.pedidoLinx + ")" : ""} [${p.client || ""}${p.etapa ? " · " + p.etapa : ""}]: ${p.falta}`)
        .join(" | ");
      rows.push([l.sku, l.desc, l.tam, l.falta, peds].map(esc).join(";"));
    }
    const csv = "﻿" + rows.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pecas-faltantes-${String(etapaLabel || "pcp").replace(/\s+/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!linhas.length) return null;
  return (
    <Card style={{ marginBottom: 16, borderLeft: `3px solid ${C.red}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ ...F.title, fontSize: 14, fontWeight: 800, color: C.gray800 }}>Peças Faltantes — {etapaLabel}</div>
          <div style={{ ...F.body, fontSize: 12, color: C.gray500, marginTop: 2 }}>{linhas.length} item(ns) · <strong>{totalFalta}</strong> peça(s) faltando no total. Clique numa linha pra ver os pedidos.</div>
        </div>
        <button onClick={exportarCSV} style={{ background: C.green, color: C.white, border: "none", borderRadius: 7, padding: "9px 16px", cursor: "pointer", ...F.body, fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 7 }}>
          <Ic n="download" s={14} c={C.white} /> Exportar CSV
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 520 }}>
          <thead><tr style={{ borderBottom: `2px solid ${C.gray200}`, background: C.gray50 }}>
            {["Código", "Descrição", "Tamanho", "Qtd Faltante", "Pedidos"].map((h, hi) => (
              <th key={hi} style={{ padding: "8px 10px", textAlign: hi === 3 ? "right" : "left", ...F.body, fontSize: 11, color: C.gray500, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {linhas.flatMap(l => {
              const open = aberta === l.key;
              const rows = [
                <tr key={l.key} onClick={() => setAberta(open ? null : l.key)} style={{ borderBottom: `1px solid ${C.gray100}`, cursor: "pointer", background: open ? C.red + "08" : "transparent" }}>
                  <td style={{ padding: "8px 10px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, color: C.gray700 }}>{l.sku || "—"}</td>
                  <td style={{ padding: "8px 10px", ...F.body, color: C.gray700 }}>{l.desc || "—"}</td>
                  <td style={{ padding: "8px 10px", ...F.body, color: C.gray500 }}>{l.tam || "—"}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 800, color: C.red, ...F.body }}>{l.falta}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", ...F.body, fontSize: 12, color: C.gray400, whiteSpace: "nowrap" }}>{open ? "▲" : "▼"} {l.pedidos.length}</td>
                </tr>
              ];
              if (open) rows.push(
                <tr key={l.key + "__ped"}><td colSpan={5} style={{ padding: "0 10px 10px", background: C.gray50 }}>
                  <div style={{ ...F.body, fontSize: 10.5, color: C.gray500, padding: "8px 0 5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pedidos com esta peça faltando</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[...l.pedidos].sort((a, b) => b.falta - a.falta).map((p, pi) => (
                      <div key={pi} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, ...F.body, fontSize: 12, color: C.gray700, padding: "5px 9px", background: C.white, borderRadius: 5, border: `1px solid ${C.gray200}` }}>
                        <span style={{ minWidth: 0, flex: 1 }}><strong>{String(p.id).replace(/^PED-/, "")}</strong>{p.pedidoLinx ? ` · PED ${p.pedidoLinx}` : ""} — {p.client || "—"}</span>
                        {p.etapa && <span style={{ flexShrink: 0, ...F.body, fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", ...(p.etapa === "Buscar em Loja" ? { background: C.purple + "18", color: C.purple } : p.etapa === "Análise Produção" ? { background: "#0891b218", color: "#0891b2" } : { background: C.gray100, color: C.gray600 }) }}>{p.etapa}</span>}
                        <span style={{ fontWeight: 800, color: C.red, whiteSpace: "nowrap" }}>{p.falta} pç</span>
                      </div>
                    ))}
                  </div>
                </td></tr>
              );
              return rows;
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── BONIFICAÇÕES ─────────────────────────────────────────────────────────────
// Processo APARTADO: o pedido nasce direto aqui, um OK já finaliza, e ele não
// entra em nenhum indicador do sistema. Antes esses pedidos nasciam em
// "Em Separação" e ficavam eternamente pendentes, sujando fila e métrica.
// Quando o pedido tem bordado, o card mostra em que etapa o bordado está — quem
// dá o OK precisa saber se a peça já está pronta.
// ── PENDENTE PAGAMENTO ───────────────────────────────────────────────────────
// Pedidos que terminaram a expedição mas não podem faturar porque o pagamento
// não foi liberado no ERP. Ficam aqui até o cron detectar o pagamento (a cada
// 5 min) ou alguém liberar manualmente com motivo. O Pós-Venda cobra o cliente
// a partir desta tela e registra o que foi combinado.
function PendentePagamento({onOpen,user}){
  const [pedidos,setPedidos]=useState(null);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState(null);
  const [busca,setBusca]=useState("");
  const [agindo,setAgindo]=useState({});
  const [feito,setFeito]=useState({});
  const [aberto,setAberto]=useState({});      // id -> mostra painel de tratativa
  const [texto,setTexto]=useState({});        // id -> texto digitado
  const [hist,setHist]=useState({});          // pvId -> [tratativas]

  const carregar=()=>{
    setLoading(true);setLoadError(null);
    apiFetch("/pendente-pagamento")
      .then(res=>{
        if(res.success)setPedidos((res.data||[]).map(o=>normalizarCard(o,"Pendente Pagamento")));
        else setLoadError(res.error||"Erro desconhecido");
      })
      .catch(e=>setLoadError(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[]);

  const abrirTratativa=async(o)=>{
    const novo=!aberto[o.id];
    setAberto(p=>({...p,[o.id]:novo}));
    if(novo&&!hist[o.posvendaId]){
      try{
        const r=await apiFetch(`/pendente-pagamento-tratativas/${o.posvendaId}`);
        setHist(p=>({...p,[o.posvendaId]:r.data||[]}));
      }catch{ setHist(p=>({...p,[o.posvendaId]:[]})); }
    }
  };

  const registrar=async(o)=>{
    const t=String(texto[o.id]||"").trim();
    if(!t){alert("Escreva o que foi combinado com o cliente.");return;}
    setAgindo(p=>({...p,[o.id]:"tratativa"}));
    try{
      const r=await apiFetch(`/pendente-pagamento-tratativa/${o.posvendaId}`,"POST",{tratativa:t,ctx:{executor:user?.nome||"Usuário SGP"}});
      if(r.success){
        setTexto(p=>({...p,[o.id]:""}));
        setHist(p=>({...p,[o.posvendaId]:[{texto:"[SGP] [COBRANÇA] "+t,em:new Date().toISOString()},...(p[o.posvendaId]||[])]}));
      } else alert("Erro: "+(r.error||"desconhecido"));
    }catch(e){alert("Erro: "+e.message);}
    finally{setAgindo(p=>({...p,[o.id]:false}));}
  };

  const liberar=async(o)=>{
    const motivo=prompt(`Liberar o pedido ${o.pedidoLinx||o.vendasId} para Análise de Frete SEM a confirmação de pagamento do ERP?\n\nDescreva o motivo (obrigatório — fica registrado na timeline):`);
    if(motivo===null)return;
    if(!String(motivo).trim()){alert("Motivo obrigatório.");return;}
    setAgindo(p=>({...p,[o.id]:"liberar"}));
    try{
      const r=await apiFetch(`/pendente-pagamento-liberar/${o.posvendaId}`,"POST",{motivo:String(motivo).trim(),ctx:{executor:user?.nome||"Usuário SGP"}});
      if(r.success){ setFeito(p=>({...p,[o.id]:"Análise de Frete"})); setTimeout(carregar,1200); }
      else alert("Erro: "+(r.error||"desconhecido"));
    }catch(e){alert("Erro: "+e.message);}
    finally{setAgindo(p=>({...p,[o.id]:false}));}
  };

  const q=busca.trim().toLowerCase();
  const lista=(pedidos||[]).filter(o=>{
    if(!q)return true;
    return [o.pedidoLinx,o.vendasId,o.client,o.razaoSocial].map(x=>String(x||"").toLowerCase()).join(" ").includes(q);
  });
  // Há quanto tempo está parado nesta caixa.
  const diasParado=(o)=>{
    const base=o.etapaAt||o.entradaAt;
    if(!base)return null;
    return Math.max(0,Math.floor((Date.now()-new Date(base).getTime())/86400000));
  };
  const totalRetido=lista.reduce((s,o)=>s+(Number(o.valor)||0),0);

  return(
    <div style={{padding:20}}>
      <PageH title="Pendente Pagamento" sub="Pedidos embalados que não podem faturar porque o pagamento não foi liberado. Assim que o ERP confirmar, o pedido segue sozinho para Análise de Frete." onRefresh={carregar} refreshing={loading}/>

      {/* A trava só age na SAÍDA da Expedição — quem já estava na Análise de
          Frete antes dela existir continua lá, mesmo sem pagamento liberado.
          Este botão varre a fila do frete e traz esses pedidos pra cá.
          Sempre mostra a prévia antes de mover. */}
      {user?.admin&&
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px",marginBottom:14}}>
          <div style={{...F.body,fontSize:12,fontWeight:700,color:C.gray700,marginBottom:2}}>Trazer da Análise de Frete</div>
          <div style={{...F.body,fontSize:11.5,color:C.gray500,marginBottom:10}}>
            Procura na Análise de Frete os pedidos sem faturamento liberado e move para cá. Mostra a lista antes de mover.
          </div>
          <MiniAcaoAdmin
            rota="/admin/migrar-pendente-pagamento"
            rotulo="Verificar Análise de Frete"
            rotuloExec={n=>`Mover ${n} pedido${n!==1?"s":""} para Pendente Pagamento`}
            vazio="Nenhum pedido na Análise de Frete está sem pagamento liberado."
            linha={p=>`${p.linx?"PED - "+p.linx+" · ":""}${p.cliente||"—"} · ${fmtR(p.valor||0)}`}
          />
        </div>}

      {!loading&&!loadError&&lista.length>0&&
        <div style={{background:"#be123c0e",border:"1px solid #be123c33",borderRadius:8,padding:"12px 16px",marginBottom:14,display:"flex",gap:20,flexWrap:"wrap"}}>
          <div><div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase"}}>Pedidos retidos</div>
            <div style={{...F.title,fontSize:20,fontWeight:800,color:"#be123c"}}>{lista.length}</div></div>
          <div><div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase"}}>Valor parado</div>
            <div style={{...F.title,fontSize:20,fontWeight:800,color:"#be123c"}}>{fmtR(totalRetido)}</div></div>
        </div>}

      <div style={{marginBottom:12}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por pedido ou cliente..."
          style={{width:"100%",maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando pedidos...</div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {!loading&&!loadError&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhum pedido encontrado para a busca.":"Nenhum pedido retido por pagamento."}</div>}

      {lista.map(o=>{
        const done=feito[o.id];
        const busy=agindo[o.id];
        const dias=diasParado(o);
        const tratativas=hist[o.posvendaId]||[];
        return(
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:12,borderLeft:"3px solid #be123c"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:240}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <Tag label="Pagamento pendente" color="#be123c"/>
                  <TagCentroCusto cc={o.centroCusto}/>
                  {dias!=null&&<span style={{...F.body,fontSize:11,fontWeight:700,color:dias>=7?C.red:dias>=3?C.amber:C.gray500}}>
                    {dias===0?"parado hoje":`parado há ${dias} dia${dias>1?"s":""}`}
                  </span>}
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças</div>
                <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>
                  Emissão: <strong style={{color:C.gray700}}>{o.dataFechamento?fmtDS(o.dataFechamento):"—"}</strong>
                  {o.condicaoPagamento?<> · Condição: <strong style={{color:C.gray700}}>{o.condicaoPagamento}</strong></>:null}
                </div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen&&onOpen(o)}/>
                <Btn label={aberto[o.id]?"Fechar cobrança":"Registrar cobrança"} variant="secondary" size="sm" onClick={()=>abrirTratativa(o)}/>
                {done
                  ? <span style={{background:C.green+"18",color:"#065f46",border:`1px solid ${C.green}55`,borderRadius:6,padding:"9px 16px",...F.body,fontWeight:700,fontSize:12,display:"inline-flex",alignItems:"center",gap:6}}>
                      <Ic n="check" s={14} c="#065f46"/> Enviado p/ {done}
                    </span>
                  : <button onClick={()=>liberar(o)} disabled={!!busy}
                      style={{background:busy==="liberar"?"#ccc":"#be123c",color:C.white,border:"none",borderRadius:6,padding:"10px 16px",cursor:busy?"wait":"pointer",...F.body,fontWeight:700,fontSize:12.5}}>
                      {busy==="liberar"?"Liberando...":"Liberar mesmo assim"}
                    </button>}
              </div>
            </div>

            {aberto[o.id]&&
              <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.gray100}`}}>
                <label style={{...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>O que foi combinado com o cliente</label>
                <textarea value={texto[o.id]||""} onChange={e=>setTexto(p=>({...p,[o.id]:e.target.value}))} rows={2}
                  placeholder="Ex: falei com o financeiro do cliente, o pagamento sai dia 20; ou aguardando comprovante por e-mail..."
                  style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                  <Btn label={busy==="tratativa"?"Registrando...":"Registrar cobrança"} icon="check" variant="success" size="sm" disabled={!!busy} onClick={()=>registrar(o)}/>
                </div>
                {tratativas.length>0&&
                  <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                    <div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase"}}>Histórico de cobrança</div>
                    {tratativas.map((t,i)=>(
                      <div key={i} style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 10px"}}>
                        <div style={{...F.body,fontSize:12,color:C.gray700}}>{String(t.texto).replace("[SGP] [COBRANÇA] ","")}</div>
                        <div style={{...F.body,fontSize:10.5,color:C.gray400,marginTop:2}}>{t.em?fmtD(t.em):""}</div>
                      </div>
                    ))}
                  </div>}
              </div>}
          </Card>
        );
      })}
    </div>
  );
}

function Bonificacoes({onOpen,user}){
  const [pedidos,setPedidos]=useState(null);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState(null);
  const [agindo,setAgindo]=useState({});
  const [feito,setFeito]=useState({});
  const [busca,setBusca]=useState("");
  // Sub-abas: pendentes (fila de OK) e finalizadas (histórico de quem já saiu).
  const [aba,setAba]=useState("pendentes");
  const [finalizadas,setFinalizadas]=useState(null);
  const [finLoading,setFinLoading]=useState(false);
  const [finErro,setFinErro]=useState(null);
  const [finDias,setFinDias]=useState(90);

  const carregar=()=>{
    setLoading(true);setLoadError(null);
    apiFetch("/bonificacoes")
      .then(res=>{
        if(res.success)setPedidos((res.data||[]).map(o=>normalizarCard(o,"Bonificações")));
        else setLoadError(res.error||"Erro desconhecido");
      })
      .catch(e=>setLoadError(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[]);

  // Finalizadas: carrega sob demanda (só ao abrir a aba) e quando muda o período.
  const carregarFinalizadas=(dias)=>{
    setFinLoading(true);setFinErro(null);
    apiFetch(`/bonificacoes-finalizadas?dias=${dias||finDias}`)
      .then(res=>{
        if(res.success)setFinalizadas((res.data||[]).map(o=>normalizarCard(o,"Finalizado")));
        else setFinErro(res.error||"Erro desconhecido");
      })
      .catch(e=>setFinErro(e.message))
      .finally(()=>setFinLoading(false));
  };
  useEffect(()=>{ if(aba==="finalizadas"&&finalizadas===null) carregarFinalizadas(finDias); },[aba]);

  const concluir=async(o)=>{
    if(!o.posvendaId){alert("Pedido sem negócio de Pós-venda.");return;}
    const aviso=o.temBordado&&!o.amOk
      ? "\n\n⚠ Este pedido tem bordado que ainda não está aprovado/finalizado."
      : "";
    if(!confirm(`Concluir a bonificação do pedido ${o.pedidoLinx||o.vendasId}?${aviso}\n\nO pedido será finalizado.`))return;
    setAgindo(p=>({...p,[o.id]:true}));
    try{
      const r=await apiFetch("/bonificacao-concluida/"+o.posvendaId,"POST",{ctx:{executor:user?.nome||"Usuário SGP"}});
      if(r.success){setFeito(p=>({...p,[o.id]:r.proximaEtapa||"Finalizado"}));setTimeout(carregar,1200);}
      else alert("Erro: "+(r.error||"desconhecido"));
    }catch(e){alert("Erro: "+e.message);}
    finally{setAgindo(p=>({...p,[o.id]:false}));}
  };

  const q=busca.trim().toLowerCase();
  const lista=(pedidos||[]).filter(o=>{
    if(!q)return true;
    return [o.pedidoLinx,o.vendasId,o.client,o.razaoSocial].map(x=>String(x||"").toLowerCase()).join(" ").includes(q);
  });

  // Finalizadas passam pelo mesmo filtro de busca da aba de pendentes.
  const listaFin=(finalizadas||[]).filter(o=>{
    if(!q)return true;
    return [o.pedidoLinx,o.vendasId,o.client,o.razaoSocial,o.notaFiscal].map(x=>String(x||"").toLowerCase()).join(" ").includes(q);
  });
  const abaBtn=(id,texto,n)=>(
    <button onClick={()=>setAba(id)}
      style={{background:aba===id?C.teal:C.white,color:aba===id?C.white:C.gray600,
        border:`1.5px solid ${aba===id?C.teal:C.gray200}`,borderRadius:7,padding:"8px 16px",
        ...F.body,fontSize:13,fontWeight:700,cursor:"pointer"}}>
      {texto}{typeof n==="number"?` (${n})`:""}
    </button>
  );

  return(
    <div style={{padding:20}}>
      <PageH title="Bonificações" sub="Processo apartado: ao dar OK o pedido é finalizado. Não entra em nenhum indicador."
        onRefresh={()=>aba==="pendentes"?carregar():carregarFinalizadas(finDias)}
        refreshing={aba==="pendentes"?loading:finLoading}/>

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {abaBtn("pendentes","Pendentes",pedidos?pedidos.length:undefined)}
        {abaBtn("finalizadas","Finalizadas",finalizadas?finalizadas.length:undefined)}
      </div>

      <div style={{marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)}
          placeholder={aba==="pendentes"?"Buscar por pedido ou cliente...":"Buscar por pedido, cliente ou NF..."}
          style={{flex:1,minWidth:240,maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}/>
        {aba==="finalizadas"&&
          <select value={finDias} onChange={e=>{const d=Number(e.target.value);setFinDias(d);carregarFinalizadas(d);}}
            style={{...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",background:C.white}}>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
            <option value={180}>Últimos 180 dias</option>
            <option value={365}>Último ano</option>
          </select>}
      </div>

      {/* ── ABA FINALIZADAS ─────────────────────────────────────────────── */}
      {aba==="finalizadas"&&<>
        {finLoading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando histórico...</div>}
        {finErro&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {finErro}</div>}
        {!finLoading&&!finErro&&<div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>{listaFin.length} bonificação{listaFin.length!==1?"ões":""} finalizada{listaFin.length!==1?"s":""} no período</div>}
        {!finLoading&&!finErro&&listaFin.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhuma bonificação encontrada para a busca.":"Nenhuma bonificação finalizada neste período."}</div>}
        {listaFin.map(o=>(
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:12,borderLeft:`3px solid ${C.green}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <Tag label="Bonificação" color={C.teal}/>
                  <TagCentroCusto cc={o.centroCusto}/>
                  <Tag label={o.temBordado?"Com bordado":"Sem bordado"} color={o.temBordado?C.purple:C.gray600}/>
                  {o.notaFiscal&&<Tag label={"NF "+o.notaFiscal} color={C.green}/>}
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)}{o.qtdTotal?` · ${o.qtdTotal} peças`:""}</div>
                <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>
                  Emissão: <strong style={{color:C.gray700}}>{o.dataFechamento?fmtD(o.dataFechamento):"—"}</strong>
                  {" · "}Finalizado em: <strong style={{color:C.gray700}}>{o.finalizadoEm?fmtD(o.finalizadoEm):"—"}</strong>
                </div>
              </div>
              <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen&&onOpen(o)}/>
            </div>
          </Card>
        ))}
      </>}

      {/* ── ABA PENDENTES ───────────────────────────────────────────────── */}
      {aba==="pendentes"&&<>
      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando pedidos...</div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {!loading&&!loadError&&<div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>{lista.length} pedido{lista.length!==1?"s":""} de bonificação</div>}
      {!loading&&!loadError&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhum pedido encontrado para a busca.":"Nenhuma bonificação pendente."}</div>}

      {lista.map(o=>{
        const done=feito[o.id];
        const busy=agindo[o.id];
        return(
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:12,borderLeft:`3px solid ${C.teal}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <Tag label="Bonificação" color={C.teal}/>
                  <TagCentroCusto cc={o.centroCusto}/>
                  {/* Bonificação é processo apartado: aqui interessa só SE o
                      pedido tem bordado, não em que ponto do bordado ele está. */}
                  <Tag label={o.temBordado?"Com bordado":"Sem bordado"} color={o.temBordado?C.purple:C.gray600}/>
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças</div>
                <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>Emissão: <strong style={{color:C.gray700}}>{o.dataFechamento?fmtD(o.dataFechamento):"—"}</strong></div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen&&onOpen(o)}/>
                {done
                  ? <span style={{background:C.green+"18",color:"#065f46",border:`1px solid ${C.green}55`,borderRadius:6,padding:"9px 16px",...F.body,fontWeight:700,fontSize:12,display:"inline-flex",alignItems:"center",gap:6}}>
                      <Ic n="check" s={14} c="#065f46"/> {done}
                    </span>
                  : <Btn label={busy?"Finalizando...":"OK — finalizar"} icon="check" variant="success" disabled={!!busy} onClick={()=>concluir(o)}/>}
              </div>
            </div>
          </Card>
        );
      })}
      </>}
    </div>
  );
}

// Ação administrativa em dois passos: simula (mostra a lista) e só então executa.
// Reaproveitada por qualquer rota que siga o padrão { simulacao, total, lista }.
function MiniAcaoAdmin({rota,rotulo,rotuloExec,vazio,linha}){
  const [carregando,setCarregando]=useState(false);
  const [previa,setPrevia]=useState(null);
  const simular=async()=>{
    setCarregando(true);
    try{
      const r=await apiFetch(rota,"POST",{});
      if(r.error){alert("Erro: "+r.error);return;}
      setPrevia(r);
    }catch(e){alert("Erro: "+e.message);}
    finally{setCarregando(false);}
  };
  const executar=async()=>{
    if(!confirm(`${rotuloExec(previa.total)}?`))return;
    setCarregando(true);
    try{
      const r=await apiFetch(rota,"POST",{executar:true});
      if(r.error){alert("Erro: "+r.error);return;}
      alert(`Pronto: ${r.movidos??r.total} pedido(s) processado(s).`);
      setPrevia(null);
    }catch(e){alert("Erro: "+e.message);}
    finally{setCarregando(false);}
  };
  return(
    <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <Btn label={carregando?"Consultando...":rotulo} icon="search" variant="secondary" disabled={carregando} onClick={simular}/>
        {previa&&previa.total>0&&<Btn label={rotuloExec(previa.total)} icon="check" variant="success" disabled={carregando} onClick={executar}/>}
      </div>
      {previa&&<div style={{marginTop:10}}>
        {previa.total===0
          ? <div style={{...F.body,fontSize:13,color:C.green}}>{vazio}</div>
          : <div style={{maxHeight:200,overflowY:"auto",border:`1px solid ${C.gray200}`,borderRadius:6}} className="sgp-scroll">
              {previa.lista.map((p,i)=>(
                <div key={p.posvendaId||i} style={{padding:"7px 12px",borderBottom:`1px solid ${C.gray100}`,...F.body,fontSize:12}}>{linha(p)}</div>
              ))}
            </div>}
      </div>}
    </div>
  );
}

// Botão de migração — em Configurações. Mostra a lista antes de mover nada.
function MigrarBonificacoesBtn(){
  const [carregando,setCarregando]=useState(false);
  const [previa,setPrevia]=useState(null);
  const simular=async()=>{
    setCarregando(true);
    try{
      const r=await apiFetch("/admin/migrar-bonificacoes","POST",{});
      if(r.error){alert("Erro: "+r.error);return;}
      setPrevia(r);
    }catch(e){alert("Erro: "+e.message);}
    finally{setCarregando(false);}
  };
  const executar=async()=>{
    if(!confirm(`Mover ${previa.total} pedido(s) de bonificação para a caixa de Bonificações?`))return;
    setCarregando(true);
    try{
      const r=await apiFetch("/admin/migrar-bonificacoes","POST",{executar:true});
      if(r.error){alert("Erro: "+r.error);return;}
      alert(`Pronto: ${r.movidos} pedido(s) movido(s).`);
      setPrevia(null);
    }catch(e){alert("Erro: "+e.message);}
    finally{setCarregando(false);}
  };
  return(
    <Card style={{marginBottom:16}}>
      <SecH>Migrar bonificações presas</SecH>
      <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>
        Procura pedidos com Tipo de pedido = Bonificação parados em etapas abertas e move para a caixa de Bonificações. Primeiro mostra a lista, sem alterar nada.
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <Btn label={carregando?"Consultando...":"Ver pedidos a migrar"} icon="search" variant="secondary" disabled={carregando} onClick={simular}/>
        {previa&&previa.total>0&&<Btn label={`Migrar ${previa.total} pedido(s)`} icon="check" variant="success" disabled={carregando} onClick={executar}/>}
      </div>
      <div style={{height:1,background:C.gray100,margin:"16px 0"}}/>
      <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:10}}>
        <strong>Tirar da caixa quem não é bonificação.</strong> A regra chegou a considerar a natureza fiscal e puxou pedidos comuns (remessa para demonstração, amostra grátis). Isto devolve esses pedidos para Em Separação, e o fluxo os reposiciona sozinho.
      </div>
      <MiniAcaoAdmin
        rota="/admin/reverter-bonificacoes"
        rotulo="Ver pedidos a devolver"
        rotuloExec={(n)=>`Devolver ${n} pedido(s) ao fluxo normal`}
        vazio="Nenhum pedido indevido na caixa."
        linha={(p)=>`${p.pedido} · ${p.nome} — tipo: ${p.tipo||"—"}${p.natureza?` · ${p.natureza}`:""}`}
      />
      {previa&&<div style={{marginTop:12}}>
        {previa.total===0
          ? <div style={{...F.body,fontSize:13,color:C.green}}>Nenhuma bonificação presa — está tudo certo.</div>
          : <div style={{maxHeight:240,overflowY:"auto",border:`1px solid ${C.gray200}`,borderRadius:6}} className="sgp-scroll">
              {previa.lista.map(p=>(
                <div key={p.posvendaId} style={{padding:"8px 12px",borderBottom:`1px solid ${C.gray100}`,...F.body,fontSize:12}}>
                  <strong>{p.pedido||p.posvendaId}</strong> · {p.nome} <span style={{color:C.gray500}}>— {p.etapaAtual}</span>
                </div>
              ))}
            </div>}
      </div>}
    </Card>
  );
}

// ─── SILK / DTF ───────────────────────────────────────────────────────────────
// Caixa de produção para pedidos com item de silk ou DTF. Silk/DTF tem
// prioridade sobre bordado: se o pedido tem uma dessas peças, ele vem pra cá
// depois da conferência, e a informação de bordado é ignorada.
// Detecção espelha a do worker (ehSilkDtf) — SKU 51.2.* ou nome começando com
// SILK/DTF. Os 08.01.* são BORDADO e NÃO entram.
const REGEX_SILK_DTF = /^\s*(?:[\d.\-]{4,}\s+)?(silk|dtf)\b/i;
function itemEhSilkDtf(it){
  const sku=String(it?.sku||"").trim();
  if(sku==="51.2.0006"||sku==="51.2.0007")return true;
  const nome=String(it?.desc||it?.nome||it?.sku||"").trim();
  return !!(nome&&REGEX_SILK_DTF.test(nome));
}
function pedidoEhSilkDtf(o){
  if(o?.temSilkDtf===true)return true;
  return (o?.items||[]).some(itemEhSilkDtf);
}

function SilkDtf({onOpen,slaCfg,user}){
  const [pedidos,setPedidos]=useState(null);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState(null);
  const [agindo,setAgindo]=useState({});
  const [feito,setFeito]=useState({});
  const [busca,setBusca]=useState("");

  const carregar=()=>{
    setLoading(true);setLoadError(null);
    apiFetch("/silk-dtf")
      .then(res=>{
        if(res.success)setPedidos((res.data||[]).map(o=>normalizarCard(o,"Silk/DTF")));
        else setLoadError(res.error||"Erro desconhecido");
      })
      .catch(e=>setLoadError(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[]);

  const concluir=async(o)=>{
    if(!o.posvendaId){alert("Pedido sem negócio de Pós-venda.");return;}
    if(!confirm(`Confirmar que o silk/DTF do pedido ${o.pedidoLinx||o.vendasId} está pronto?\n\nO pedido segue para a Expedição.`))return;
    setAgindo(p=>({...p,[o.id]:true}));
    try{
      const r=await apiFetch("/silk-dtf-concluido/"+o.posvendaId,"POST",{ctx:{executor:user?.nome||"Usuário SGP"}});
      if(r.success){setFeito(p=>({...p,[o.id]:r.proximaEtapa||"Expedição"}));setTimeout(carregar,1200);}
      else alert("Erro: "+(r.error||"desconhecido"));
    }catch(e){alert("Erro: "+e.message);}
    finally{setAgindo(p=>({...p,[o.id]:false}));}
  };

  // Relatório: uma linha por PEÇA de silk/DTF, no mesmo formato do CSV do PCP.
  const exportarCSV=()=>{
    const lista=pedidos||[];
    if(!lista.length){alert("Nada para exportar.");return;}
    const cols=["Pedido Linx","ID HubSpot","Cliente","CNPJ","SKU","Descrição","Tamanho","Quantidade","Entrou na etapa","Dias na etapa","Prazo do pedido"];
    const linhas=[];
    for(const o of lista){
      const pecas=(o.items||[]).filter(itemEhSilkDtf);
      const dias=o.etapaAt?diasUteisDesde(o.etapaAt):"";
      const entrou=o.etapaAt?fmtD(o.etapaAt):"";
      const prazo=dataVencimento(o)?fmtVenc(dataVencimento(o)):"";
      if(!pecas.length){
        linhas.push([o.pedidoLinx||"",o.vendasId||"",o.client||"",o.cnpj||"","","","","",entrou,dias,prazo]);
        continue;
      }
      for(const it of pecas){
        linhas.push([o.pedidoLinx||"",o.vendasId||"",o.client||"",o.cnpj||"",
          it.sku||"",it.desc||"",it.cor||"",it.qty||0,entrou,dias,prazo]);
      }
    }
    const csv="﻿"+[cols,...linhas]
      .map(r=>r.map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(";")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=`silk-dtf_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const q=busca.trim().toLowerCase();
  const lista=(pedidos||[]).filter(o=>{
    if(!q)return true;
    const alvo=[o.pedidoLinx,o.vendasId,o.client,o.razaoSocial,
      ...(o.items||[]).filter(itemEhSilkDtf).map(it=>it.desc)]
      .map(x=>String(x||"").toLowerCase()).join(" ");
    return alvo.includes(q);
  });
  const totalPecas=lista.reduce((s,o)=>s+(o.items||[]).filter(itemEhSilkDtf).reduce((a,it)=>a+(Number(it.qty)||0),0),0);

  return(
    <div style={{padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
        <PageH title="Silk / DTF" sub="Pedidos com peças de silk ou DTF aguardando produção. Ao concluir, seguem para a Expedição." onRefresh={carregar} refreshing={loading}/>
        <button onClick={exportarCSV} disabled={!lista.length}
          style={{background:lista.length?C.green:C.gray200,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",cursor:lista.length?"pointer":"not-allowed",...F.body,fontWeight:700,fontSize:13,display:"inline-flex",alignItems:"center",gap:7}}>
          <Ic n="download" s={14} c={C.white}/> Exportar relatório
        </button>
      </div>

      <div style={{marginBottom:12}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)}
          placeholder="Buscar por pedido, cliente ou peça..."
          style={{width:"100%",maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando pedidos...</div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {!loading&&!loadError&&<div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>
        {lista.length} pedido{lista.length!==1?"s":""} · {totalPecas} peça{totalPecas!==1?"s":""} de silk/DTF
      </div>}
      {!loading&&!loadError&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhum pedido encontrado para a busca.":"Nenhum pedido em silk/DTF."}</div>}

      {lista.map(o=>{
        const done=feito[o.id];
        const busy=agindo[o.id];
        const sla=getSLA(o,slaCfg);
        const pecas=(o.items||[]).filter(itemEhSilkDtf);
        return(
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:12,borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.purple}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <TagCentroCusto cc={o.centroCusto}/>
                  {o.ehOcorrencia&&<TagOcorrencia size="sm"/>}
                  <ETag etapa="Silk/DTF"/><TagDataEspecial o={o} size="sm"/>
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen&&onOpen(o)}/>
                {done
                  ? <span style={{background:C.green+"18",color:"#065f46",border:`1px solid ${C.green}55`,borderRadius:6,padding:"9px 16px",...F.body,fontWeight:700,fontSize:12,display:"inline-flex",alignItems:"center",gap:6}}>
                      <Ic n="check" s={14} c="#065f46"/> Enviado p/ {done}
                    </span>
                  : <Btn label={busy?"Enviando...":"Silk/DTF concluído"} icon="check" variant="success" disabled={!!busy} onClick={()=>concluir(o)}/>}
              </div>
            </div>
            {pecas.length>0&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.gray100}`}}>
              <div style={{...F.body,fontSize:10,color:C.gray500,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Peças de silk / DTF</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {pecas.map((it,i)=>(
                  <span key={it.id||i} style={{...F.body,fontSize:11.5,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"4px 9px",color:C.gray700}}>
                    {it.desc||it.sku}{it.cor?` · ${it.cor}`:""} <strong>×{it.qty}</strong>
                  </span>
                ))}
              </div>
            </div>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── OCORRÊNCIA ───────────────────────────────────────────────────────────────
// Telas do funil de devolução/reclamação. Quatro modos:
//   simples       → um botão que só avança a etapa (faturamento e pós-venda)
//   qualidade     → formulário de parecer (tipo + procedente/improcedente + motivo)
//   improcedencia → dois setores em paralelo; encerra quando ambos concluem
//   painel        → visão somente leitura de tudo que está aberto no funil
const OCOR_TIPOS = [
  "Defeito de bordado","Tamanho errado","Item trocado","Erro de separação",
  "Atraso na entrega","Avaria no transporte","Outro",
];

function TagOcorrencia({size="md"}){
  const s = size==="sm";
  return(
    <span style={{...F.title,fontSize:s?9:10,fontWeight:800,letterSpacing:"0.08em",padding:s?"2px 7px":"3px 9px",borderRadius:5,background:C.red,color:C.white,whiteSpace:"nowrap"}}>
      OCORRÊNCIA
    </span>
  );
}

function CaixaOcorrencia({title, sub, endpoint, etapaLabel, modo="simples", acaoLabel, apiPath, onOpen, slaCfg, user}) {
  const [pedidos, setPedidos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [agindo, setAgindo] = useState({});
  const [feito, setFeito] = useState({});
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({});   // id -> {tipo, parecer, motivo}

  const carregar = () => {
    setLoading(true); setLoadError(null);
    apiFetch(endpoint)
      .then(res => {
        if (res.success) setPedidos((res.data || []).map(o => normalizarCard(o, etapaLabel)));
        else setLoadError(res.error || "Erro desconhecido");
      })
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { carregar(); }, [endpoint]);

  const postar = async (o, caminho, body, chaveBusy) => {
    setAgindo(p => ({...p, [o.id]: chaveBusy || true}));
    try {
      const r = await apiFetch(caminho + "/" + (o.ocorrenciaId || o.posvendaId), "POST", {
        ...body, ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if (r.success) {
        setFeito(p => ({...p, [o.id]: r.proximaEtapa || "Concluído"}));
        setTimeout(carregar, 1200);
      } else alert("Erro: " + (r.error || "desconhecido"));
    } catch (e) { alert("Erro: " + e.message); }
    finally { setAgindo(p => ({...p, [o.id]: false})); }
  };

  const salvarParecer = (o) => {
    const f = form[o.id] || {};
    if (!f.tipo)    { alert("Escolha o tipo da reclamação."); return; }
    if (!f.parecer) { alert("Marque se a ocorrência é procedente ou improcedente."); return; }
    if (!String(f.motivo || "").trim()) { alert("Descreva o motivo da análise — é obrigatório."); return; }
    if (f.parecer === "Procedente"
      && !confirm("Confirmar PROCEDENTE?\n\nO pedido vai ser liberado para a separação e seguir o fluxo normal de produção."))
      return;
    if (f.parecer === "Improcedente"
      && !confirm("Confirmar IMPROCEDENTE?\n\nSerá aberta uma tratativa para o Pós-Venda avisar o cliente e para a Separação dar baixa no estoque."))
      return;
    postar(o, "/ocor-registro-reclamacao", { tipo: f.tipo, parecer: f.parecer, motivo: f.motivo });
  };

  const q = busca.trim().toLowerCase();
  const lista = (pedidos || []).filter(o => {
    if (!q) return true;
    return [o.pedidoLinx, o.vendasId, o.ocorrenciaId, o.client, o.razaoSocial, o.ocorrenciaRelato]
      .map(x => String(x || "").toLowerCase()).join(" ").includes(q);
  });

  const setF = (id, campo, valor) => setForm(p => ({...p, [id]: {...(p[id] || {}), [campo]: valor}}));
  const lbl = {...F.body, fontSize:10, fontWeight:700, color:C.gray500, textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:5};

  return (
    <div style={{padding:20}}>
      <PageH title={title} sub={sub} onRefresh={carregar} refreshing={loading}/>

      <div style={{marginBottom:12}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)}
          placeholder="Buscar por pedido, cliente ou relato..."
          style={{width:"100%",maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando ocorrências...</div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {!loading&&!loadError&&<div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>{lista.length} ocorrência{lista.length!==1?"s":""}</div>}
      {!loading&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhuma ocorrência encontrada para a busca.":"Nenhuma ocorrência nesta caixa."}</div>}

      {lista.map(o => {
        const done = feito[o.id];
        const busy = agindo[o.id];
        const f = form[o.id] || {};
        const sla = getSLA(o, slaCfg);
        return (
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:12,borderLeft:`4px solid ${C.red}`}}>
            {/* Cabeçalho */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap",marginBottom:10}}>
              <div style={{minWidth:0,flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <TagOcorrencia size="sm"/>
                  <span style={{...F.title,fontSize:15,fontWeight:700,color:C.black}}>{o.client||"—"}</span>
                  {o.ocorrenciaTipo&&<Tag label={o.ocorrenciaTipo} color={C.amber}/>}
                  {o.ocorrenciaParecer&&<Tag label={o.ocorrenciaParecer} color={o.ocorrenciaParecer==="Procedente"?C.green:C.gray600}/>}
                </div>
                <div style={{...F.body,fontSize:11.5,color:C.gray500}}>
                  {o.pedidoLinx?`Pedido ${o.pedidoLinx} · `:""}HubSpot {o.ocorrenciaId||o.vendasId}
                  {o.cnpj?` · ${o.cnpj}`:""}
                  {sla?.texto?` · ${sla.texto}`:""}
                </div>
              </div>
              <Btn label="Abrir pedido" variant="secondary" size="sm" onClick={()=>onOpen&&onOpen(o)}/>
            </div>

            {/* Relato do cliente — o que o vendedor registrou na abertura */}
            {o.ocorrenciaRelato&&<div style={{padding:"10px 12px",background:C.gray50,borderRadius:6,marginBottom:10,border:`1px solid ${C.gray200}`}}>
              <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Relato do cliente</div>
              <div style={{...F.body,fontSize:13,color:C.gray700,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{o.ocorrenciaRelato}</div>
            </div>}

            {/* Parecer já registrado (aparece na tratativa de improcedência) */}
            {modo!=="qualidade"&&o.ocorrenciaMotivo&&<div style={{padding:"10px 12px",background:C.amber+"0c",borderRadius:6,marginBottom:10,border:`1px solid ${C.amber}33`}}>
              <div style={{...F.body,fontSize:10,fontWeight:700,color:C.amber,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Parecer da Qualidade</div>
              <div style={{...F.body,fontSize:13,color:C.gray700,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{o.ocorrenciaMotivo}</div>
            </div>}

            {done
              ? <div style={{padding:"10px 14px",borderRadius:6,background:C.green+"12",border:`1px solid ${C.green}33`,...F.body,fontSize:13,color:C.green,fontWeight:600}}>✓ {done}</div>
              : <>
                {/* MODO SIMPLES — só confirma e avança */}
                {modo==="simples"&&
                  <Btn label={busy?"Enviando...":acaoLabel} icon="check" variant="success" disabled={!!busy}
                    onClick={()=>postar(o, apiPath, {})}/>}

                {/* MODO QUALIDADE — tipo + parecer + motivo */}
                {modo==="qualidade"&&<div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginBottom:10}}>
                    <div>
                      <label style={lbl}>Tipo da reclamação</label>
                      <select value={f.tipo||""} onChange={e=>setF(o.id,"tipo",e.target.value)}
                        style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:C.white}}>
                        <option value="">— selecione —</option>
                        {OCOR_TIPOS.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Parecer</label>
                      <div style={{display:"flex",gap:8}}>
                        {[["Procedente",C.green],["Improcedente",C.gray600]].map(([p,cor])=>{
                          const on=f.parecer===p;
                          return(
                            <button key={p} onClick={()=>setF(o.id,"parecer",p)}
                              style={{flex:1,padding:"9px 10px",borderRadius:6,border:`1.5px solid ${on?cor:C.gray200}`,background:on?cor+"12":C.white,color:on?cor:C.gray600,cursor:"pointer",...F.body,fontSize:12.5,fontWeight:on?700:500}}>
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={lbl}>Motivo da análise (obrigatório)</label>
                    <textarea value={f.motivo||""} onChange={e=>setF(o.id,"motivo",e.target.value)} rows={3}
                      placeholder={f.parecer==="Improcedente"?"Explique por que a reclamação não procede — este texto vai para o vendedor e para o cliente.":"Descreva o que foi constatado na análise."}
                      style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
                  </div>
                  <Btn label={busy?"Registrando...":"Registrar parecer"} icon="check" variant="success" disabled={!!busy}
                    onClick={()=>salvarParecer(o)}/>
                </div>}

                {/* MODO IMPROCEDÊNCIA — dois setores em paralelo */}
                {modo==="improcedencia"&&<div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
                    {[
                      {k:"posvenda", nome:"Pós-Venda", ok:o.improcPosvendaOk, desc:"Avisar o vendedor/cliente da improcedência e o motivo."},
                      {k:"separacao",nome:"Separação", ok:o.improcSeparacaoOk,desc:"Dar baixa no estoque das peças devolvidas."},
                    ].map(s=>(
                      <div key={s.k} style={{padding:"12px 14px",borderRadius:8,border:`1.5px solid ${s.ok?C.green:C.gray200}`,background:s.ok?C.green+"0a":C.white}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <span style={{...F.body,fontSize:13,fontWeight:700,color:s.ok?C.green:C.gray700}}>{s.nome}</span>
                          {s.ok&&<Tag label="Concluído" color={C.green}/>}
                        </div>
                        <div style={{...F.body,fontSize:11.5,color:C.gray500,marginBottom:10,lineHeight:1.45}}>{s.desc}</div>
                        {s.ok
                          ? <div style={{...F.body,fontSize:12,color:C.green,fontWeight:600}}>✓ Nada pendente aqui</div>
                          : <Btn label={busy===s.k?"Enviando...":"Marcar como concluído"} size="sm" variant="success" icon="check" disabled={!!busy}
                              onClick={()=>{
                                const obs = window.prompt("Observação (opcional) — o que foi feito:", "");
                                if (obs === null) return;
                                postar(o, "/ocor-improcedencia", { setor: s.k, obs }, s.k);
                              }}/>}
                      </div>
                    ))}
                  </div>
                  <div style={{...F.body,fontSize:11.5,color:C.gray400,marginTop:10}}>
                    A ocorrência só é encerrada quando os dois setores concluírem.
                  </div>
                </div>}

                {/* MODO PAINEL — somente leitura */}
                {modo==="painel"&&<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <Tag label={o.etapa||"—"} color={C.gray600}/>
                  {o.improcPosvendaOk&&<Tag label="PV concluiu" color={C.green}/>}
                  {o.improcSeparacaoOk&&<Tag label="Separação concluiu" color={C.green}/>}
                </div>}
              </>}
          </Card>
        );
      })}
    </div>
  );
}

function CaixaPCP({title, sub, endpoint, etapaLabel, acoes, onOpen, slaCfg, user, faltantesExtraEndpoints, semFaltantes}) {
  const [pedidos, setPedidos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [agindo, setAgindo] = useState({});
  const [feito, setFeito]   = useState({});
  const [busca, setBusca]   = useState("");
  const [subAba, setSubAba] = useState("pedidos");
  // Pedidos das OUTRAS caixas PCP — só pra alimentar a tabela de faltantes da
  // Análise PCP (visão completa: inclui o que já foi pra Loja/Produção).
  const [pedidosExtra, setPedidosExtra] = useState([]);

  const carregar = () => {
    setLoading(true); setLoadError(null);
    apiFetch(endpoint)
      .then(res => {
        if (res.success) setPedidos((res.data || []).map(o => normalizarCard(o, etapaLabel)));
        else setLoadError(res.error || "Erro desconhecido");
      })
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false));
    const extras = faltantesExtraEndpoints || [];
    if (extras.length) {
      Promise.all(extras.map(ep => apiFetch(ep).then(r => r.success ? (r.data || []) : []).catch(() => [])))
        .then(listas => setPedidosExtra(listas.flat().map(o => normalizarCard(o, "PCP"))))
        .catch(() => setPedidosExtra([]));
    } else {
      setPedidosExtra([]);
    }
  };
  useEffect(() => { carregar(); }, [endpoint]);

  // Base da tabela de faltantes: pedidos desta caixa + (opcional) das outras PCP.
  const pedidosFaltantes = [...(pedidos || []), ...(pedidosExtra || [])];

  const executar = async (o, acao) => {
    if (!o.posvendaId) { alert("Pedido sem negócio de Pós-venda."); return; }
    // Ação que exige um dado do usuário antes de executar (ex.: nº da OP).
    let extra = {};
    if (acao.pedirCampo) {
      const val = window.prompt(acao.pedirCampo.label, o[acao.pedirCampo.chave] || "");
      if (val === null) return;                       // cancelou
      const limpo = String(val).trim();
      if (!limpo) { alert("É obrigatório informar " + acao.pedirCampo.label.toLowerCase() + "."); return; }
      extra[acao.pedirCampo.chave] = limpo;
    }
    if (acao.confirmMsg && !confirm(acao.confirmMsg)) return;
    setAgindo(prev => ({...prev, [o.id]: acao.label}));
    try {
      const r = await apiFetch(acao.apiPath + "/" + o.posvendaId, "POST", {
        ...(acao.body || {}),
        ...extra,
        ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if (r.success) {
        setFeito(prev => ({...prev, [o.id]: r.proximaEtapa || acao.label}));
        setTimeout(() => carregar(), 1200);
      } else alert("Erro: " + (r.error || "desconhecido"));
    } catch (e) { alert("Erro: " + e.message); }
    finally { setAgindo(prev => ({...prev, [o.id]: false})); }
  };

  const q = busca.trim().toLowerCase();
  const lista = (pedidos || []).filter(o => {
    if (!q) return true;
    const alvo = [o.pedidoLinx, o.vendasId, String(o.id||"").replace(/^PED-/,""), o.client, o.razaoSocial]
      .map(x => String(x||"").toLowerCase()).join(" ");
    return alvo.includes(q);
  });

  return (
    <div style={{padding:20}}>
      <PageH title={title} sub={sub} onRefresh={carregar} refreshing={loading}/>
      {/* Sub-abas: lista de pedidos x tabela de peças faltantes.
          A tabela de faltantes é do fluxo de PCP (pedido separado parcial). Nas
          etapas de SOB MEDIDA ela não faz sentido — a peça nem existe ainda, não
          há o que faltar — então a tela vira só a lista. */}
      {!semFaltantes&&<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {[["pedidos","Pedidos"],["faltantes","Tabela de Peças Faltantes"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSubAba(id)}
            style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${subAba===id?C.red:C.gray200}`,background:subAba===id?C.red+"10":C.white,color:subAba===id?C.red:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:subAba===id?700:500}}>{lbl}</button>
        ))}
      </div>}
      {subAba==="pedidos"&&<div style={{marginBottom:12}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)}
          placeholder="Buscar por Pedido Linx, ID HubSpot ou cliente..."
          style={{width:"100%",maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}/>
      </div>}
      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando pedidos...</div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {subAba==="faltantes"&&!loading&&!loadError&&<TabelaFaltantes pedidos={pedidosFaltantes} etapaLabel={etapaLabel}/>}
      {subAba==="faltantes"&&!loading&&!loadError&&(()=>{const temFalta=pedidosFaltantes.some(o=>(o.items||[]).some(it=>!it.naoSeparavel&&Number(it.saldoSeparacao||0)>0));return temFalta?null:<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhuma peça faltante nesta etapa.</div>;})()}
      {subAba==="pedidos"&&!loading&&!loadError&&<div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>{lista.length} pedido{lista.length!==1?"s":""} nesta caixa</div>}
      {subAba==="pedidos"&&!loading&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhum pedido encontrado para a busca.":"Nenhum pedido nesta caixa."}</div>}
      {subAba==="pedidos"&&lista.map(o => {
        const done = feito[o.id];
        const busy = agindo[o.id];
        const sla = getSLA(o, slaCfg);
        return (
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:14, borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.purple}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <ETag etapa={etapaLabel}/><TagDataEspecial o={o} size="sm"/>
                  {/* SOB MEDIDA: não há estoque pra separar (a peça vai ser
                      fabricada), então o status de separação sai do card e no
                      lugar entra o PRAZO — que é o que importa nessa fila. */}
                  {ehEtapaSobMedida(etapaLabel)
                    ?<PrazoSobMedida o={o} inline/>
                    :<BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>}
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças</div>
                {(!ehEtapaSobMedida(etapaLabel)&&o.qtdSeparada!=null)&&<div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>Separado: <strong style={{color:C.gray700}}>{o.qtdSeparada||0}</strong> de <strong style={{color:C.gray700}}>{o.qtdTotal||0}</strong> peças</div>}
                {ehEtapaSobMedida(etapaLabel)&&<div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>Fechamento: <strong style={{color:C.gray700}}>{o.dataFechamento?fmtDS(o.dataFechamento):"—"}</strong> · prazo de {PRAZO_SOB_MEDIDA_DIAS} dias</div>}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen(o)}/>
                {done ? (
                  <span style={{background:C.green+"18",color:"#065f46",border:`1px solid ${C.green}55`,borderRadius:6,padding:"9px 16px",...F.body,fontWeight:700,fontSize:12,display:"inline-flex",alignItems:"center",gap:6}}>
                    <Ic n="check" s={14} c="#065f46"/> Enviado p/ {done}
                  </span>
                ) : acoes.map((acao,ai)=>(
                  <button key={ai} onClick={()=>executar(o,acao)} disabled={!!busy}
                    style={{background:busy?"#ccc":acao.cor,color:C.white,border:"none",borderRadius:6,padding:"10px 18px",cursor:busy?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,display:"inline-flex",alignItems:"center",gap:6}}>
                    {acao.icon&&<Ic n={acao.icon} s={14} c={C.white}/>}
                    {busy===acao.label ? "Enviando..." : acao.label}
                  </button>
                ))}
              </div>
            </div>
            {/* SOB MEDIDA: o formulário com as medidas fica direto no card, sem
                precisar abrir o pedido — quem cria a OP e quem produz precisam
                dele em mãos o tempo todo. */}
            {(o.formularioSobMedida&&o.formularioSobMedida.length>0)&&
              <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.gray100}`}}>
                <div style={{...F.body,fontSize:10,color:"#92400e",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Formulário Sob Medida</div>
                <ArquivosBox fileIds={o.formularioSobMedida} emptyText="Nenhum formulário anexado."/>
              </div>}
          </Card>
        );
      })}
    </div>
  );
}

function ConferenciaSeparacao({orders, onOpen, slaCfg, user}) {
  const [confirming, setConfirming] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [busca, setBusca] = useState("");

  // PERF: usa o snapshot COMPARTILHADO (mesmo hook das outras filas). Antes esta
  // tela disparava um apiFetch("/snapshot-aberto") próprio a cada abertura —
  // ignorando o cache do app e, muitas vezes, forçando o worker a reconstruir o
  // quadro inteiro. Era por isso que ela demorava bem mais que as demais.
  const snap = useSnapshotAberto();
  const loading = snap.loading && !snap.data;
  const loadError = snap.error;
  const carregar = snap.refresh;
  const pedidos = useMemo(() => {
    if (!snap.data) return null;
    const items = snap.data.porEtapa?.["Conferência Separação"]?.items || [];
    return items.map(o => normalizarCard(o, "Conferência Separação"));
  }, [snap.data]);

  const confirmarConferencia = async (o) => {
    if (!o.posvendaId) { alert("Pedido sem negócio de Pós-venda."); return; }
    setConfirming(prev => ({...prev, [o.id]: true}));
    try {
      const r = await apiFetch("/conferir-separacao/" + o.posvendaId, "POST", {
        statusSeparacao: o.statusSeparacao,
        ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if (r.success) {
        setConfirmed(prev => ({...prev, [o.id]: r.proximaEtapa}));
        // Card sai da caixa na hora; o refresh logo atrás confirma.
        snapRemoverPedido(o.vendasId, "Conferência Separação");
        setTimeout(() => carregar(), 1200);
      } else {
        alert("Erro: " + (r.error || "desconhecido"));
      }
    } catch (e) {
      alert("Erro: " + e.message);
    } finally {
      setConfirming(prev => ({...prev, [o.id]: false}));
    }
  };

  const q = busca.trim().toLowerCase();
  const lista = (pedidos || []).filter(o => {
    if (!q) return true;
    const alvo = [
      o.pedidoLinx,
      o.vendasId,
      String(o.id || "").replace(/^PED-/, ""),
      o.client,
      o.razaoSocial,
    ].map(x => String(x || "").toLowerCase()).join(" ");
    return alvo.includes(q);
  });

  return (
    <div style={{padding:20}}>
      <PageH title="Conferência Separação" sub="WMS bipou. Aguardando conferência manual antes de seguir." onRefresh={carregar} refreshing={loading}/>
      <div style={{marginBottom:12}}>
        <input
          value={busca}
          onChange={e=>setBusca(e.target.value)}
          placeholder="Buscar por Pedido Linx, ID HubSpot ou cliente..."
          style={{width:"100%",maxWidth:440,...F.body,fontSize:13,padding:"10px 12px",border:`1px solid ${C.gray200}`,borderRadius:8,outline:"none",boxSizing:"border-box"}}
        />
      </div>
      {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#0369a1"+"0e",border:`1px solid #0369a128`,borderRadius:8,...F.body,fontSize:13,color:"#0369a1"}}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        Carregando pedidos...
      </div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {!loading&&!loadError&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:C.green+"0e",border:`1px solid ${C.green}28`,borderRadius:7,...F.body,fontSize:12,color:C.green,marginBottom:12}}>
        <Ic n="check" s={13} c={C.green}/> {lista.length} pedido{lista.length!==1?"s":""} aguardando conferência
      </div>}
      {!loading&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhum pedido encontrado para a busca.":"Nenhum pedido aguardando conferência."}</div>}
      {lista.map(o => {
        const isConfirmed = confirmed[o.id];
        const isConfirming = confirming[o.id];
        const sla = getSLA(o, slaCfg);
        return (
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:14, borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:"#0369a1"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <ETag etapa="Conferência Separação"/>
                  <BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>
                  {o.temBordado===false && <Tag label="Sem bordado" color={C.gray600}/>}
                  {o.temBordado!==false && <Tag label="Com bordado" color={C.red}/>}
                  {sla.st!=="ok" && <Tag label={sla.st==="late"?"Etapa atrasada":"Etapa em risco"} color={sla.st==="late"?C.red:C.amber}/>}
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>
                  {o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças
                </div>
                <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>
                  Separado: <strong style={{color:C.gray700}}>{o.qtdSeparada||0}</strong> de <strong style={{color:C.gray700}}>{o.qtdTotal||0}</strong> peças
                  {" · próxima etapa: "}
                  <strong style={{color:C.gray700}}>{o.statusSeparacao==="parcial" ? "Análise PCP" : (o.temBordado===false ? "Expedição" : "Conferência e Direcionamento")}</strong>
                </div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen(o)}/>
                {isConfirmed ? (
                  <span style={{background:C.green+"18",color:"#065f46",border:`1px solid ${C.green}55`,borderRadius:6,padding:"9px 16px",...F.body,fontWeight:700,fontSize:12,display:"inline-flex",alignItems:"center",gap:6}}>
                    <Ic n="check" s={14} c="#065f46"/> Enviado p/ {isConfirmed}
                  </span>
                ) : (
                  <button
                    onClick={() => confirmarConferencia(o)}
                    disabled={isConfirming}
                    style={{background:isConfirming?"#ccc":"#0369a1",color:C.white,border:"none",borderRadius:6,padding:"10px 20px",cursor:isConfirming?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,display:"inline-flex",alignItems:"center",gap:6}}>
                    <Ic n="check" s={14} c={C.white}/>
                    {isConfirming ? "Confirmando..." : "Conferido"}
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── DIRECIONADOR (Conferência e Direcionamento — só COM bordado agora) ────
function Direcionamento({orders,setOrders,onOpen,slaCfg,user}){
  const [loading,setLoading]=useState(false);
  const [loadError,setLoadError]=useState(null);
  const [hsOrders,setHsOrders]=useState(null); // null = não carregado ainda
  const [capLot,setCapLot]=useState({capacidade:{},lotacao:{}}); // capacidade + lotação por destino
  const [lotLoading,setLotLoading]=useState(true);

  const carregarDir=()=>{
    setLoading(true);
    setLotLoading(true);
    setLoadError(null);
    setConfirmed({});
    setDestMap({});
    setSel({});
    apiFetch("/capacidade-lotacao").then(r=>{ if(r.success)setCapLot({capacidade:r.capacidade||{},lotacao:r.lotacao||{}}); }).catch(()=>{}).finally(()=>setLotLoading(false));
    apiFetch("/conferencia-direcionamento")
      .then(res=>{
        if(res.success){
          const converted=res.data.map(o=>({
            id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
            pedidoLinx:o.pedidoLinx||"",
            client:o.client,cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",
            tel:o.telefone||"",email:o.email||"",
            obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
            condicaoPagamento:o.condicaoPagamento||"",vendedor:o.vendedor,valor:o.valor,
            prazoFinal:o.prazoFinal||new Date(Date.now()+7*86400000).toISOString(),
            etapa:"Conferência e Direcionamento",amOk:o.amostrasAprovada,sepOk:o.separacaoCompleta,
            entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
  // SLA da Conferência e Direcionamento contado a partir da aprovação da amostra
  // (pedido separado antes do bordado ficar pronto — ver worker).
  slaDesdeAprovacaoAmostra:o.slaDesdeAprovacaoAmostra===true,
            alertas:o.alertas||[],concluido:false,
            bordado:{pts:0,cores:[],arq:"",arqOk:false,amDig:[],amDigObs:"",amFis:[],amFisObs:""},
            arquivoBordado:o.arquivoBordado||[],arquivoDtfsilk:o.arquivoDtfsilk||[],
            historico:o.historico||[],
            houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
            veioDoAguardandoAmostra:o.veioDoAguardandoAmostra===true,
            slaDesdeAprovacaoAmostra:o.slaDesdeAprovacaoAmostra===true,
            temBordado:o.temBordado!==false,temSilkDtf:o.temSilkDtf===true,dataVencimento:o.dataVencimento||null,
            items:(o.items||[]).map(it=>({
              id:it.id,bordado:it.bordado===true,sku:it.sku||it.nome,desc:it.nome,cor:it.tamanho,qty:it.quantidade,
              dest:it.direcionamento?it.direcionamento.toLowerCase():null,
              status:it.status==="faltante"?"faltante":"separado",
            })),
            timeline:[{stage:"Conferência e Direcionamento",user:"Sistema",enteredAt:o.etapaAt||o.dataEntrada,exitedAt:null,dH:null}],
            chat:[],
          }));
          setHsOrders(converted);
        }
      })
      .catch(e=>setLoadError(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregarDir,[]);
  useEffect(()=>{
    _refreshListeners.push(carregarDir);
    return ()=>{_refreshListeners=_refreshListeners.filter(f=>f!==carregarDir);};
  },[]);

  // Usa dados reais se carregados, senão usa mock
  const activeOrders = hsOrders !== null ? hsOrders : orders;
  // amOk = amostra aprovada OU não necessária (bordado em "Liberado para bordar"+).
  // "Prontos" não pode filtrar por etapa==="Direcionamento" (etapa foi renomeada
  // pra "Conferência e Direcionamento") — senão a lista fica sempre vazia.
  // Sem bordado NÃO espera amostra — entra direto em "prontos" (card com só o
  // botão Conferido). "pendentes" (aguardando amostra) é só pra quem tem bordado.
  const pendentes=activeOrders.filter(o=>!o.amOk&&o.temBordado!==false&&!o.concluido);
  const prontosAll=activeOrders.filter(o=>(o.amOk||o.temBordado===false)&&!o.concluido);
  // "Saíram do aguardando amostra": estavam separados esperando a amostra e ela
  // acabou de sair. Ficam numa aba própria (tratativa mais rápida) e saem da
  // lista principal pra chamar atenção.
  const saira=prontosAll.filter(o=>o.veioDoAguardandoAmostra===true);
  const prontosMain=prontosAll.filter(o=>o.veioDoAguardandoAmostra!==true);
  // `prontos` (depende de `aba`) é definido mais abaixo, DEPOIS do useState de `aba`.
  // Estado local de seleção por pedido: {orderId: {sku: true/false}}
  const[sel,setSel]=useState({});
  const[destMap,setDestMap]=useState({});// {orderId: {sku: "interno"|"externo"}}
  const[bordadorMap,setBordadorMap]=useState({});// {orderId: {sku: "bordadel"|"mg_bordados"|"outros"}}

  // ── Sugestão de direcionamento por capacidade ──────────────────────────────
  const cap=capLot.capacidade||{}, lot=capLot.lotacao||{};
  const cheio=(d)=>{const c=Number(cap[d]||0);return c>0&&Number(lot[d]||0)>=c;};
  const bordadorSugerido=()=> !cheio("bordadel")?"bordadel": !cheio("mg_bordados")?"mg_bordados":"outros";
  const ehJaleco=(it)=>/jaleco/i.test((it&&(it.desc||it.nome||it.sku))||"");
  const sugerir=(it)=>{
    if(ehJaleco(it)) return {dir:"externo",bordador:bordadorSugerido()};
    if(!cheio("interno")) return {dir:"interno"};
    return {dir:"externo",bordador:bordadorSugerido()};
  };
  const LABEL_BORDADOR={bordadel:"Bordadel",mg_bordados:"MG Bordados",outros:"Outros"};
  const setBordador=(oid,sku,b)=>setBordadorMap(prev=>({...prev,[oid]:{...(prev[oid]||{}),[sku]:b}}));
  const[confirmed,setConfirmed]=useState({});// orderId: bool
  const[pendentesAberto,setPendentesAberto]=useState(false);// caixa recolhível
  const[aba,setAba]=useState("direcionamento");// "direcionamento" | "saira" (saíram do aguardando amostra)
  // Lista exibida na área principal, conforme a aba (usa `aba` já inicializado).
  const prontos=aba==="saira"?saira:prontosMain;
  const[itensAbertos,setItensAbertos]=useState({});// {orderId: bool} — itens recolhidos por padrão
  const toggleItens=(oid)=>setItensAbertos(p=>({...p,[oid]:!p[oid]}));

  const toggleSel=(oid,sku)=>{
    setSel(prev=>({...prev,[oid]:{...(prev[oid]||{}),[sku]:!(prev[oid]||{})[sku]}}));
  };
  const selAll=(oid,itemSkus)=>{
    const allOn=itemSkus.every(s=>(sel[oid]||{})[s]);
    const next={};itemSkus.forEach(s=>next[s]=!allOn);
    setSel(prev=>({...prev,[oid]:next}));
  };
  const setDest=(oid,sku,dest)=>{
    setDestMap(prev=>({...prev,[oid]:{...(prev[oid]||{}),[sku]:dest}}));
    if(dest==="externo") setBordadorMap(prev=>{const cur=(prev[oid]||{})[sku];return cur?prev:{...prev,[oid]:{...(prev[oid]||{}),[sku]:bordadorSugerido()}};});
  };
  const setDestSelected=(oid,dest,itemSkus)=>{
    const selSkus=itemSkus.filter(s=>(sel[oid]||{})[s]);
    if(selSkus.length===0){alert("Selecione ao menos um item.");return;}
    const next={...(destMap[oid]||{})};
    selSkus.forEach(s=>next[s]=dest);
    setDestMap(prev=>({...prev,[oid]:next}));
    if(dest==="externo") setBordadorMap(prev=>{const nb={...(prev[oid]||{})};selSkus.forEach(s=>{if(!nb[s])nb[s]=bordadorSugerido();});return {...prev,[oid]:nb};});
  };
  const setDestAll=(oid,dest,itemSkus)=>{
    const next={};itemSkus.forEach(s=>next[s]=dest);
    setDestMap(prev=>({...prev,[oid]:next}));
    if(dest==="externo") setBordadorMap(prev=>{const nb={...(prev[oid]||{})};itemSkus.forEach(s=>{if(!nb[s])nb[s]=bordadorSugerido();});return {...prev,[oid]:nb};});
  };
  const confirm=async(oid,items)=>{
    const dm=destMap[oid]||{};
    const allSet=items.every(it=>dm[it.id||it.sku]);
    if(!allSet){alert("Defina o destino (Interno/Externo) para todos os itens antes de confirmar.");return;}

    // Encontra o pedido para pegar bordadoId e posvendaId
    const ordem=(hsOrders||[]).find(o=>o.id===oid);
    if(!ordem||!ordem.bordadoId||!ordem.posvendaId){
      alert("Pedido sem negócio de Bordado/Pós-venda associado.");return;
    }

    // Monta destinos por ID do objeto: { "<objetoId>": { dir, bordador } }
    const bm=bordadorMap[oid]||{};
    const destinos={};
    items.forEach(it=>{
      const key=it.id||it.sku;
      const val=dm[key];
      if(!val) return;
      if(val==="interno") destinos[key]={dir:"Interno"};
      else destinos[key]={dir:"Externo",bordador:bm[key]||"outros"};
    });

    try{
      const res=await apiFetch(`/direcionamento/${ordem.posvendaId}`,"PATCH",{
        bordadoId:ordem.bordadoId,
        destinos:destinos,
        ctx:{
          executor:user?.nome||user?.name||"Sistema",
          executorEmail:user?.email||"",
          vendasId:ordem.vendasId||null,
          posvendaId:ordem.posvendaId||null,
          bordadoId:ordem.bordadoId||null,
          cliente:ordem.client||"",
          etapa:"Direcionamento",
        },
      });
      if(res.error) throw new Error(res.error);
      setConfirmed(prev=>({...prev,[oid]:true}));
      // Recarrega após o HubSpot processar
      setTimeout(()=>carregarDir(),1000);
    }catch(e){
      alert("Erro ao confirmar direcionamento: "+e.message);
    }
  };

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Conferência e Direcionamento" sub="Confira o pedido separado. Se tiver bordado, defina destinos." onRefresh={carregarDir} refreshing={loading}/>
      <PainelLotacao capLot={capLot} carregando={lotLoading} destinos={["interno","bordadel","mg_bordados","outros"]} titulo="Capacidade x lotação — usada para a sugestão"/>
      {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        Carregando pedidos do HubSpot...
      </div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,display:"flex",alignItems:"center",gap:8}}>
        <Ic n="warn" s={14} c={C.red}/> Erro ao carregar: {loadError}
        <button onClick={()=>window.location.reload()} style={{marginLeft:"auto",background:C.red,color:C.white,border:"none",borderRadius:5,padding:"4px 10px",cursor:"pointer",...F.body,fontSize:12}}>Tentar novamente</button>
      </div>}
      {hsOrders!==null&&!loading&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:C.green+"0e",border:`1px solid ${C.green}28`,borderRadius:7,...F.body,fontSize:12,color:C.green}}>
        <Ic n="check" s={13} c={C.green}/> {hsOrders.length} pedido{hsOrders.length!==1?"s":""} carregado{hsOrders.length!==1?"s":""} do HubSpot
      </div>}
      {/* Abas: Direcionamento | Saíram do aguardando amostra (com badge) */}
      <div style={{display:"flex",gap:2,marginBottom:2,borderBottom:`1.5px solid ${C.gray200}`}}>
        <div onClick={()=>setAba("direcionamento")}
          style={{padding:"10px 18px 11px",cursor:"pointer",...F.body,fontSize:13,fontWeight:aba==="direcionamento"?700:500,color:aba==="direcionamento"?C.black:C.gray500,borderBottom:aba==="direcionamento"?`2px solid ${C.red}`:"2px solid transparent"}}>
          Direcionamento
        </div>
        <div onClick={()=>setAba("saira")}
          style={{position:"relative",padding:"10px 22px 11px 18px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,...F.body,fontSize:13,fontWeight:aba==="saira"?700:500,color:aba==="saira"?"#b45309":C.gray500,borderBottom:aba==="saira"?`2px solid #f59e0b`:"2px solid transparent"}}>
          <Ic n="warn" s={13} c={aba==="saira"?"#b45309":C.gray400}/> Saíram do aguardando amostra
          {saira.length>0&&<span style={{position:"absolute",top:2,right:2,background:C.red,color:C.white,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800,minWidth:16,textAlign:"center",boxShadow:"0 0 0 2px "+C.white}}>{saira.length}</span>}
        </div>
      </div>
      {aba==="saira"&&<div style={{background:"#fffbeb",border:`1px solid #f59e0b40`,borderRadius:8,padding:"10px 14px",...F.body,fontSize:12,color:"#92400e",display:"flex",alignItems:"center",gap:8}}>
        <Ic n="warn" s={14} c="#f59e0b"/> Estes pedidos já estavam separados e só agora tiveram a amostra aprovada. Priorize o direcionamento.
      </div>}
      {/* Pedidos aguardando amostra — caixa recolhível */}
      {aba==="direcionamento"&&pendentes.length>0&&(
        <div>
          <div onClick={()=>setPendentesAberto(v=>!v)}
            style={{background:C.amber+"10",border:`1px solid ${C.amber}38`,borderRadius:8,padding:"10px 16px",marginBottom:pendentesAberto?10:0,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
            <Ic n="warn" s={15} c={C.amber}/>
            <span style={{...F.title,fontSize:12,fontWeight:700,color:C.amber,letterSpacing:"0.08em"}}>AGUARDANDO APROVAÇÃO DE AMOSTRA — {pendentes.length}</span>
            <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,...F.body,fontSize:11,color:C.amber,fontWeight:600}}>
              {pendentesAberto?"Recolher":"Ver"}
              <span style={{display:"inline-block",transition:"transform 0.2s",transform:pendentesAberto?"rotate(180deg)":"none"}}>
                <Ic n="chevDown" s={14} c={C.amber}/>
              </span>
            </span>
          </div>
          {pendentesAberto&&pendentes.map(o=>(
            <div key={o.id} onClick={()=>onOpen(o)} style={{background:"#fffbeb",border:`1px solid ${C.amber}40`,borderLeft:`3px solid ${C.amber}`,borderRadius:8,padding:"12px 14px",cursor:"pointer",marginBottom:8,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div><span style={{...F.body,fontWeight:700}}>{idPedido(o)}</span><span style={{...F.body,color:C.gray500,fontSize:12,marginLeft:8}}>{o.client}</span></div>
              <Tag label="Amostra pendente" color={C.amber}/>
            </div>
          ))}
        </div>
      )}
      {/* Pedidos prontos */}
      <SecH>{aba==="saira"?"Saíram do aguardando amostra":"Prontos para direcionar"} — {prontos.length} pedido{prontos.length!==1?"s":""}</SecH>
      {loading&&hsOrders===null&&<div style={{...F.body,color:C.gray500,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <span style={{display:"inline-block",width:22,height:22,border:`3px solid ${C.gray200}`,borderTopColor:C.red,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        Carregando pedidos...
      </div>}
      {!loading&&prontos.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{aba==="saira"?"Nenhum pedido saiu do aguardando amostra no momento.":"Nenhum pedido aguardando direcionamento."}</div>}
      {prontos.map(o=>{
        // [SILK/DTF] tem PRIORIDADE sobre bordado: se o pedido tem peça de silk
        // ou DTF, a conferência manda pra caixa Silk/DTF e a informação de
        // bordado é ignorada. Pedido SEM bordado e sem silk vai pra Expedição.
        // Os dois usam o mesmo card simplificado, só muda o destino.
        const ehSilk = pedidoEhSilkDtf(o);
        if (o.temBordado === false || ehSilk) {
          const isConfirmed = confirmed[o.id];
          const sla = getSLA(o, slaCfg);
          return (
            <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:14,borderLeft:`3px solid ${C.teal}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                    {ehSilk?<Tag label="Silk / DTF" color={C.purple}/>:<Tag label="Sem bordado" color={C.gray600}/>}
                    <BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>
                    {sla.st!=="ok"&&<Tag label={sla.st==="late"?"Etapa atrasada":"Etapa em risco"} color={sla.st==="late"?C.red:C.amber}/>}
                  </div>
                  <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>
                    {o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças
                  </div>
                  <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:6}}>
                    {ehSilk
                      ? "Este pedido tem peças de silk/DTF. Confira fisicamente e envie para a produção de Silk/DTF."
                      : "Este pedido não tem bordado. Confira fisicamente e envie pra Expedição."}
                  </div>
                  {ehSilk&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                    {(o.items||[]).filter(itemEhSilkDtf).map((it,i)=>(
                      <span key={it.id||i} style={{...F.body,fontSize:11.5,background:C.purple+"10",border:`1px solid ${C.purple}33`,borderRadius:6,padding:"3px 8px",color:C.purple,fontWeight:600}}>
                        {it.desc||it.sku}{it.cor?` · ${it.cor}`:""} ×{it.qty}
                      </span>
                    ))}
                  </div>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen(o)}/>
                  <button
                    onClick={async ()=>{
                      if (isConfirmed) return;
                      try {
                        const rota = ehSilk ? "/enviar-silk-dtf/" : "/apenas-conferido/";
                        const r = await apiFetch(rota + o.posvendaId, "POST", {
                          ctx: { executor: user?.nome || "Usuário SGP" },
                        });
                        if (r.success) {
                          setConfirmed(prev => ({ ...prev, [o.id]: true }));
                          setTimeout(() => carregarDir(), 1000);
                        } else {
                          alert("Erro: " + (r.error || "desconhecido"));
                        }
                      } catch (e) {
                        alert("Erro: " + e.message);
                      }
                    }}
                    disabled={isConfirmed}
                    style={{
                      background: isConfirmed ? C.gray300 : (ehSilk ? C.purple : C.teal),
                      color: C.white, border: "none", borderRadius: 6,
                      padding: "10px 20px", cursor: isConfirmed ? "default" : "pointer",
                      fontWeight: 700, fontSize: 13, ...F.body,
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}>
                    <Ic n="check" s={14} c={C.white}/> {isConfirmed ? "Enviado ✓" : (ehSilk ? "Conferido — enviar para Silk/DTF" : "Conferido — enviar para Expedição")}
                  </button>
                </div>
              </div>
            </Card>
          );
        }

        // Pedidos COM bordado: card completo com direcionamento (fluxo original)
        // Só itens COM bordado precisam de direcionamento. Fallback legado: sem flag em nenhum → todos.
        // Ordena por SKU (agrupa mesmo produto de grades diferentes) e depois por tamanho.
        const itensComBordado=o.items.filter(it=>it.bordado);
        const itensCard=(itensComBordado.length?itensComBordado:o.items).slice().sort((a,b)=>{
          const sa=String(a.sku||"");
          const sb=String(b.sku||"");
          if(sa!==sb) return sa.localeCompare(sb);
          return String(a.cor||"").localeCompare(String(b.cor||""));
        });
        const skus=itensCard.map(it=>it.id||it.sku);
        const dm=destMap[o.id]||{};
        const sm=sel[o.id]||{};
        const nSel=skus.filter(s=>sm[s]).length;
        const allDefined=itensCard.every(it=>dm[it.id||it.sku]);
        const ocultos=o.items.length-itensCard.length;
        const isConfirmed=confirmed[o.id];
        const sla=getSLA(o,slaCfg);
        return(
          <Card key={o.id} especial={temDataEspecial(o)} style={{marginBottom:14,borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:STAGE_COLOR[o.etapa]||C.gray300}`}}>
            {/* Cabeçalho do pedido */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8,alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span><TagDataEspecial o={o} size="sm"/>
                  <ETag etapa={o.etapa}/><TagDataEspecial o={o} size="sm"/>
                  <BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>
                  {sla.st!=="ok"&&<Tag label={sla.st==="late"?"Etapa atrasada":"Etapa em risco"} color={sla.st==="late"?C.red:C.amber}/>}
                  {sla.ft==="late"&&<Tag label="Prazo vencido" color={C.red}/>}
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças</div>
              </div>
              <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen(o)}/>
            </div>

            {/* Barra de ações em lote */}
            <div style={{background:C.gray50,borderRadius:6,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",border:`1px solid ${C.gray200}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginRight:4}}>
                <input type="checkbox"
                  checked={nSel===skus.length&&skus.length>0}
                  onChange={()=>selAll(o.id,skus)}
                  style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
                <span style={{...F.body,fontSize:12,color:C.gray600,fontWeight:600}}>
                  {nSel===0?"Selecionar todos":nSel===skus.length?"Todos selecionados":`${nSel} selecionado${nSel>1?"s":""}`}
                </span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button onClick={()=>setDestSelected(o.id,"interno",skus)}
                  style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:700,...F.body,display:"flex",alignItems:"center",gap:5}}>
                  <Ic n="arrow" s={12} c={C.white}/> Selecionados → Interno
                </button>
                <button onClick={()=>setDestSelected(o.id,"externo",skus)}
                  style={{background:C.purple,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:700,...F.body,display:"flex",alignItems:"center",gap:5}}>
                  <Ic n="box" s={12} c={C.white}/> Selecionados → Externo
                </button>
                <button onClick={()=>setDestAll(o.id,"interno",skus)}
                  style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",...F.body}}>
                  Todos → Interno
                </button>
                <button onClick={()=>setDestAll(o.id,"externo",skus)}
                  style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",...F.body}}>
                  Todos → Externo
                </button>
              </div>
            </div>

            {/* Itens — recolhíveis (padrão: recolhido), evita poluir pedidos grandes */}
            <div onClick={()=>toggleItens(o.id)}
              style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"9px 12px",background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:7,marginBottom:itensAbertos[o.id]?12:12}}>
              <Ic n="list" s={14} c={C.gray500}/>
              <span style={{...F.body,fontSize:12,fontWeight:700,color:C.gray600}}>Itens com bordado — {itensCard.length}</span>
              <span style={{...F.body,fontSize:11,color:allDefined?C.green:C.amber,fontWeight:600}}>· {itensCard.filter(it=>dm[it.id||it.sku]).length}/{itensCard.length} direcionados</span>
              {ocultos>0&&<span style={{...F.body,fontSize:11,color:C.gray400}}>· {ocultos} sem bordado ocultos</span>}
              <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,...F.body,fontSize:11,color:C.gray500,fontWeight:600}}>
                {itensAbertos[o.id]?"Recolher":"Ver itens"}
                <span style={{display:"inline-block",transition:"transform 0.2s",transform:itensAbertos[o.id]?"rotate(180deg)":"none"}}><Ic n="chevDown" s={14} c={C.gray500}/></span>
              </span>
            </div>
            {/* Tabela de itens */}
            {itensAbertos[o.id]&&<div style={{overflowX:"auto",marginBottom:12}}>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:420}}>
                <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
                  {["","SKU","Descrição","TAM","Qtd","Destino"].map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",fontSize:11,color:C.gray500,fontWeight:700,...F.body,textTransform:"uppercase"}}>{hd}</th>)}
                </tr></thead>
                <tbody>{itensCard.map((it,idx)=>{
                  const k=it.id||it.sku;
                  const thisDest=(destMap[o.id]||{})[k]||it.dest;
                  const isSelected=(sel[o.id]||{})[k]||false;
                  return(
                    <tr key={idx} style={{borderBottom:`1px solid ${C.gray100}`,background:isSelected?C.red+"06":"transparent"}}>
                      <td style={{padding:"8px 10px"}}>
                        <input type="checkbox" checked={isSelected} onChange={()=>toggleSel(o.id,k)}
                          style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
                      </td>
                      <td style={{padding:"8px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700}}>{it.sku}</td>
                      <td style={{padding:"8px 10px",...F.body,color:C.gray700}}>{it.desc}</td>
                      <td style={{padding:"8px 10px",...F.body,color:C.gray500,fontSize:12}}>{it.cor}</td>
                      <td style={{padding:"8px 10px",fontWeight:700,...F.body}}>{it.qty}</td>
                      <td style={{padding:"8px 10px"}}>
                        {(()=>{
                          const jaleco=ehJaleco(it);
                          const sug=sugerir(it);
                          const sugTxt=sug.dir==="interno"?"Interno":`Externo · ${LABEL_BORDADOR[sug.bordador]}`;
                          const bord=(bordadorMap[o.id]||{})[k]||sug.bordador||"outros";
                          return(
                            <div style={{display:"flex",flexDirection:"column",gap:6}}>
                              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                <button onClick={()=>{if(!jaleco)setDest(o.id,k,"interno");}} disabled={jaleco} title={jaleco?"Jaleco não pode ir para Interno":""}
                                  style={{background:thisDest==="interno"?C.green:C.white,color:jaleco?C.gray400:(thisDest==="interno"?C.white:C.gray700),border:`1.5px solid ${thisDest==="interno"?C.green:C.gray300}`,borderRadius:5,padding:"4px 11px",fontSize:12,cursor:jaleco?"not-allowed":"pointer",fontWeight:600,...F.body,opacity:jaleco?0.55:1}}>
                                  Interno
                                </button>
                                <button onClick={()=>setDest(o.id,k,"externo")}
                                  style={{background:thisDest==="externo"?C.purple:C.white,color:thisDest==="externo"?C.white:C.gray700,border:`1.5px solid ${thisDest==="externo"?C.purple:C.gray300}`,borderRadius:5,padding:"4px 11px",fontSize:12,cursor:"pointer",fontWeight:600,...F.body}}>
                                  Externo
                                </button>
                                {jaleco
                                  ?<span style={{...F.body,fontSize:10,fontWeight:700,color:C.purple,background:C.purple+"14",padding:"2px 6px",borderRadius:4}}>JALECO → EXTERNO</span>
                                  :!thisDest&&<span style={{...F.body,fontSize:11,color:C.gray400}}>Sugestão: <strong style={{color:sug.dir==="interno"?C.green:C.purple}}>{sugTxt}</strong></span>}
                              </div>
                              {thisDest==="externo"&&<div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                                <span style={{...F.body,fontSize:10,color:C.gray400,marginRight:2}}>Bordador:</span>
                                {["bordadel","mg_bordados","outros"].map(b=>(
                                  <button key={b} onClick={()=>setBordador(o.id,k,b)}
                                    style={{background:bord===b?C.purple:C.white,color:bord===b?C.white:C.gray600,border:`1px solid ${bord===b?C.purple:C.gray300}`,borderRadius:4,padding:"3px 8px",fontSize:11,cursor:"pointer",fontWeight:600,...F.body}}>
                                    {LABEL_BORDADOR[b]}{sug.dir==="externo"&&sug.bordador===b?" ★":""}
                                  </button>
                                ))}
                              </div>}
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>}

            {/* Resumo + confirmar */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",gap:12,...F.body,fontSize:12,color:C.gray600}}>
                <span>Interno: <strong style={{color:C.green}}>{itensCard.filter(it=>dm[it.id||it.sku]==="interno").length} itens</strong></span>
                <span>Externo: <strong style={{color:C.purple}}>{itensCard.filter(it=>dm[it.id||it.sku]==="externo").length} itens</strong></span>
                <span style={{color:C.gray400}}>Pendente: {itensCard.filter(it=>!dm[it.id||it.sku]).length} itens</span>
              </div>
              {isConfirmed
                ?<div style={{display:"flex",alignItems:"center",gap:6,...F.body,fontSize:13,color:C.green,fontWeight:700}}><Ic n="check" s={16} c={C.green}/>Direcionamento confirmado!</div>
                :<button onClick={()=>confirm(o.id,itensCard)}
                  disabled={!allDefined}
                  style={{background:allDefined?C.green:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"9px 20px",cursor:allDefined?"pointer":"not-allowed",fontWeight:700,fontSize:13,...F.body,display:"flex",alignItems:"center",gap:7}}>
                  <Ic n="check" s={14} c={C.white}/> Confirmar direcionamento
                </button>
              }
            </div>
            {!allDefined&&!isConfirmed&&<div style={{...F.body,fontSize:11,color:C.amber,marginTop:6,display:"flex",alignItems:"center",gap:4}}>
              <Ic n="warn" s={11} c={C.amber}/> Defina o destino de todos os itens antes de confirmar.
            </div>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
// Gráfico de Previsão de Faturamento (linhas acumuladas + hover)
function GraficoPrevisao({data}){
  const [hover,setHover]=useState(null); // dia
  const WD=["D","S","T","Q","Q","S","S"];
  const W=920,H=380,padL=64,padR=20,padT=20,padB=46;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const dias=data.dias||[];
  const n=dias.length||1;
  const media=data.diasUteisDecorridos>0?(data.totalFaturadoMes/data.diasUteisDecorridos):0;
  let vAcc=0,rAcc=0,bus=0;
  const pts=dias.map(d=>{
    const vDia=data.vencimentoDia[d.dia]||0;
    const rDia=data.realizadoDia[d.dia]||0;
    vAcc+=vDia;
    const passou=d.dia<=data.hojeDia;
    if(passou) rAcc+=rDia;
    if(d.util) bus+=1;
    return {dia:d.dia,dow:d.dow,util:d.util,vDia,rDia:passou?rDia:null,vAcc,rAcc:passou?rAcc:null,mediaDia:d.util?media:0,mediaAcc:media*bus};
  });
  const maxY=Math.max(1,...pts.map(p=>Math.max(p.vAcc,p.mediaAcc,p.rAcc||0)));
  const xFor=(dia)=>padL+(n<=1?0:((dia-1)/(n-1))*plotW);
  const yFor=(v)=>padT+plotH-(v/maxY)*plotH;
  const line=(key,filtro)=>pts.filter(filtro||(()=>true)).map(p=>`${xFor(p.dia)},${yFor(p[key]||0)}`).join(" ");
  const realPts=pts.filter(p=>p.rAcc!=null);
  const realLine=realPts.map(p=>`${xFor(p.dia)},${yFor(p.rAcc)}`).join(" ");
  const realArea=realPts.length?`${xFor(realPts[0].dia)},${yFor(0)} ${realLine} ${xFor(realPts[realPts.length-1].dia)},${yFor(0)}`:"";
  const fmtK=(v)=>v>=1000000?`${(v/1000000).toFixed(1)}M`:v>=1000?`${Math.round(v/1000)}k`:String(Math.round(v));
  const yticks=[0,0.25,0.5,0.75,1].map(f=>f*maxY);
  const COR={real:C.red,venc:C.black,media:C.gray500};

  const onMove=(e)=>{
    const rect=e.currentTarget.getBoundingClientRect();
    const xRel=(e.clientX-rect.left)*(W/rect.width);
    let dia=Math.round((xRel-padL)/plotW*(n-1))+1;
    dia=Math.max(1,Math.min(n,dia));
    setHover(dia);
  };
  const hp=hover?pts.find(p=>p.dia===hover):null;

  return(
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:6}}>
        <SecH>Previsão de Faturamento — {String(data.mes).padStart(2,"0")}/{data.ano}</SecH>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",...F.body,fontSize:11,color:C.gray500}}>
          {[["Previsão Vencimento",COR.venc],["Previsão Média Faturamento",COR.media],["Faturamento Realizado",COR.real]].map(([l,c])=>(
            <span key={l} style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:14,height:3,borderRadius:2,background:c,display:"inline-block"}}/>{l}</span>
          ))}
        </div>
      </div>
      <div style={{position:"relative"}} onMouseLeave={()=>setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}} onMouseMove={onMove}>
          <defs>
            <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.red} stopOpacity="0.22"/>
              <stop offset="100%" stopColor={C.red} stopOpacity="0.02"/>
            </linearGradient>
          </defs>
          {/* grid + y labels */}
          {yticks.map((v,i)=>(
            <g key={i}>
              <line x1={padL} y1={yFor(v)} x2={W-padR} y2={yFor(v)} stroke={C.gray100} strokeWidth="1"/>
              <text x={padL-8} y={yFor(v)+4} textAnchor="end" fontSize="11" fill={C.gray400} fontFamily="monospace">{fmtK(v)}</text>
            </g>
          ))}
          {/* x labels (dia + inicial) */}
          {pts.map(p=>(
            <g key={p.dia}>
              <text x={xFor(p.dia)} y={H-padB+18} textAnchor="middle" fontSize="9" fill={hover===p.dia?C.black:C.gray500} fontWeight={hover===p.dia?700:400}>{p.dia}</text>
              <text x={xFor(p.dia)} y={H-padB+30} textAnchor="middle" fontSize="8" fill={p.dow===0||p.dow===6?C.gray300:C.gray400}>{WD[p.dow]}</text>
            </g>
          ))}
          {/* área gradiente do realizado */}
          {realArea&&<polygon points={realArea} fill="url(#gradReal)"/>}
          {/* linha previsão média (tracejada) */}
          <polyline points={line("mediaAcc")} fill="none" stroke={COR.media} strokeWidth="2" strokeDasharray="5 4" strokeLinejoin="round"/>
          {/* linha previsão vencimento */}
          <polyline points={line("vAcc")} fill="none" stroke={COR.venc} strokeWidth="2" strokeLinejoin="round"/>
          {/* linha faturamento realizado (destacada) */}
          {realLine&&<polyline points={realLine} fill="none" stroke={COR.real} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/>}
          {/* guia + pontos no hover */}
          {hp&&<>
            <line x1={xFor(hp.dia)} y1={padT} x2={xFor(hp.dia)} y2={padT+plotH} stroke={C.gray300} strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx={xFor(hp.dia)} cy={yFor(hp.vAcc)} r="4" fill={COR.venc}/>
            <circle cx={xFor(hp.dia)} cy={yFor(hp.mediaAcc)} r="4" fill={COR.media}/>
            {hp.rAcc!=null&&<circle cx={xFor(hp.dia)} cy={yFor(hp.rAcc)} r="5" fill={COR.real} stroke={C.white} strokeWidth="1.5"/>}
          </>}
        </svg>
        {/* tooltip */}
        {hp&&(
          <div style={{position:"absolute",top:8,left:`${(xFor(hp.dia)/W)*100}%`,transform:`translateX(${xFor(hp.dia)>W*0.6?"-105%":"12px"})`,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",padding:"10px 12px",pointerEvents:"none",minWidth:210,zIndex:5}}>
            <div style={{...F.title,fontSize:12,fontWeight:700,color:C.gray700,marginBottom:8}}>Dia {hp.dia} ({WD[hp.dow]})</div>
            {[["Previsão venc. (dia)",hp.vDia,COR.venc],["Previsão venc. (acum.)",hp.vAcc,COR.venc],["Média fat. (dia)",hp.mediaDia,COR.media],["Média fat. (acum.)",hp.mediaAcc,COR.media],["Faturado no dia",hp.rDia,COR.real],["Faturado acum.",hp.rAcc,COR.real]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",gap:14,...F.body,fontSize:12,marginBottom:3}}>
                <span style={{color:C.gray500,display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:2,background:c}}/>{l}</span>
                <span style={{fontWeight:700,color:v==null?C.gray300:C.black}}>{v==null?"—":fmtR(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:10}}>
        Média por dia útil: <strong style={{color:C.gray600}}>{fmtR(media)}</strong> ({data.diasUteisDecorridos} de {data.diasUteisMes} dias úteis) · passe o mouse no gráfico para ver os valores do dia.
      </div>
    </Card>
  );
}

// Gráfico de barras horizontais (sem dependência externa)
function GraficoBarrasH({itens,cor=C.red,corAtraso}){
  const max=Math.max(1,...itens.map(i=>i.valor||0));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {itens.map((it,i)=>{
        const pct=Math.max(2,((it.valor||0)/max)*100);
        const pctAtr=it.atraso!=null&&it.valor?Math.min(pct,(it.atraso/max)*100):0;
        return(
          <div key={i}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,...F.body,fontSize:12,gap:8}}>
              <span style={{fontWeight:600,color:C.gray700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{it.label}</span>
              <span style={{fontWeight:700,color:C.black,whiteSpace:"nowrap",flexShrink:0}}>{it.texto}</span>
            </div>
            <div style={{height:12,background:C.gray100,borderRadius:7,overflow:"hidden",display:"flex"}}>
              <div style={{height:"100%",width:`${pct}%`,background:cor,borderRadius:7,position:"relative"}}>
                {pctAtr>0&&corAtraso&&<div style={{position:"absolute",right:0,top:0,height:"100%",width:`${(pctAtr/pct)*100}%`,background:corAtraso,borderRadius:"0 7px 7px 0"}}/>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
// Opções de Centro de Custo (da propriedade do HubSpot)
const CENTRO_OPTIONS=[
  {value:"27",label:"27 - Corporativo"},
  {value:"10 - Concessionária",label:"10 - Concessionária"},
  {value:"31 - B2B",label:"31 - B2B"},
  {value:"03 - Licitação",label:"03 - Licitação"},
  {value:"29 - Comercial Diretoria",label:"29 - Comercial Diretoria"},
];
// Etapas em aberto, na ordem do funil, com endpoint
// ⚠ Esta era uma lista FIXA de etapas, e toda etapa nova criada depois ficava de
// fora — Análise PCP, Buscar em Loja, Análise Produção, as duas de Sob Medida,
// Silk/DTF e Bonificações sumiam do Funil e da Gestão à Vista. Como o Dashboard
// conta o snapshot inteiro, os totais divergiam (374 x 296).
// Agora a lista é DERIVADA do próprio snapshot: qualquer etapa que exista nos
// dados aparece, na ordem do funil, e o que não estiver na ordem entra no fim.
// Assim, criar etapa nova nunca mais desalinha as telas.
const ETAPAS_PAUSA=["Pendência Comercial","Aguardando Outro Pedido"];
function etapasDoSnapshot(pedidos){
  // Considera TODAS as etapas ativas do card, não só a principal. Antes, uma
  // etapa cujos pedidos estivessem todos com a etapa principal em outro lugar
  // (ex.: separação com bordado ativo) simplesmente não gerava linha/coluna —
  // a etapa desaparecia do Dashboard e do Funil mesmo tendo pedidos.
  const presentes=new Set();
  for(const o of (pedidos||[])){
    const ets=(o.etapasAtivas&&o.etapasAtivas.length)?o.etapasAtivas:[o.etapa];
    for(const e of ets) if(e) presentes.add(e);
  }
  const ordem=[...FUNIL_ORDEM,...ETAPAS_PAUSA];
  const conhecidas=ordem.filter(n=>presentes.has(n));
  const novas=[...presentes].filter(n=>!ordem.includes(n)).sort();
  return [...conhecidas,...novas].map(nome=>({nome}));
}

// Painel de capacidade x lotação (peças com bordado em aberto) por destino
function PainelLotacao({capLot,destinos,titulo,carregando}){
  const cap=capLot.capacidade||{}, lot=capLot.lotacao||{};
  const LBL={interno:"Interno",bordadel:"Bordadel",mg_bordados:"MG Bordados",outros:"Outros"};
  const COR={interno:C.green,bordadel:C.red,mg_bordados:"#7c3aed",outros:C.amber};
  return(
    <Card>
      <SecH>{titulo||"Capacidade x lotação (peças com bordado em aberto)"}</SecH>
      {carregando&&<div style={{display:"flex",alignItems:"center",gap:8,...F.body,fontSize:12,color:C.gray500,marginBottom:10}}>
        <span style={{display:"inline-block",width:14,height:14,border:`2px solid ${C.gray200}`,borderTopColor:C.red,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        Calculando lotação...
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:14,opacity:carregando?0.5:1}}>
        {destinos.map(d=>{
          const c=Number(cap[d]||0), v=Number(lot[d]||0);
          const pct=c>0?Math.min(100,(v/c)*100):(v>0?100:0);
          const over=c>0&&v>c;
          return(
            <div key={d}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,...F.body,fontSize:12,gap:8}}>
                <span style={{fontWeight:700,color:C.gray700,display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:10,height:10,borderRadius:3,background:COR[d]}}/>{LBL[d]}</span>
                <span style={{fontWeight:700,color:over?C.red:C.black,whiteSpace:"nowrap"}}>{v}{c>0?` / ${c} peças · ${Math.round((v/c)*100)}%`:" peças"}{over?" · LOTADO":""}</span>
              </div>
              <div style={{height:12,background:C.gray100,borderRadius:7,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:over?C.red:COR[d],borderRadius:7,transition:"width 0.3s"}}/>
              </div>
              {c===0&&<div style={{...F.body,fontSize:10,color:C.gray400,marginTop:3}}>Capacidade não definida — configure na aba SLA.</div>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Dashboard({onOpen,slaCfg}){
  const [grupo,setGrupo]=useState("aberto");   // aberto | finalizados
  const [centro,setCentro]=useState("");
  const [bordadoF,setBordadoF]=useState("");   // "" | com | sem
  const [statusF,setStatusF]=useState("todos");// todos | prazo | atraso
  const [busca,setBusca]=useState("");
  const [rel,setRel]=useState(null);           // relatórios de finalizados
  const [erro,setErro]=useState("");
  // Pedidos abertos vêm da fonte única (cache 20s no Worker, consistente entre telas)
  const snap = useSnapshotAberto();
  const aberto = useMemo(() => snapTodosPedidos(snap.data).map(o => normalizarCard(o, o.etapa)), [snap.data]);
  const loading = snap.loading && !snap.data;
  // Intervalo de datas (default: mês atual)
  const hoje=new Date();
  const primeiroDia=new Date(hoje.getFullYear(),hoje.getMonth(),1).toISOString().slice(0,10);
  const ultimoDia=new Date(hoje.getFullYear(),hoje.getMonth()+1,0).toISOString().slice(0,10);
  const [de,setDe]=useState(primeiroDia);
  const [ate,setAte]=useState(ultimoDia);
  const [relLoading,setRelLoading]=useState(false);
  const [exportando,setExportando]=useState(false);
  // Relatório de programação (Supabase: programacao_execucoes)
  const [relProg,setRelProg]=useState(null);
  const [relProgLoading,setRelProgLoading]=useState(false);
  const [relProgAviso,setRelProgAviso]=useState("");
  // Previsão de faturamento (mês atual)
  const [prev,setPrev]=useState(null);
  const [prevLoading,setPrevLoading]=useState(false);
  const carregarPrev=()=>{ setPrevLoading(true); apiFetch("/previsao-faturamento").then(r=>{ if(r.success)setPrev(r); }).catch(()=>{}).finally(()=>setPrevLoading(false)); };
  const carregarRelProg=async()=>{
    setRelProgLoading(true);setRelProgAviso("");
    try{
      const q=[]; if(de)q.push("de="+de); if(ate)q.push("ate="+ate);
      const r=await apiFetch("/relatorio-programacao"+(q.length?"?"+q.join("&"):""));
      setRelProg(r.data||[]);
      if(r.aviso)setRelProgAviso(r.aviso);
    }catch(e){ setRelProg([]); setRelProgAviso(e.message); }
    finally{ setRelProgLoading(false); }
  };

  const montarQuery=()=>{
    const p=[];
    if(centro)p.push("centro="+encodeURIComponent(centro));
    if(bordadoF)p.push("bordado="+bordadoF);
    if(de)p.push("de="+de);
    if(ate)p.push("ate="+ate);
    return p.length?"?"+p.join("&"):"";
  };

  const carregar = snap.refresh;

  // Carrega o relatório de finalizados.
  // Fonte dos FATURADOS: HubSpot (pedidos na etapa Faturado), data = entrada na etapa
  // (dataFinalizacao). Assim conta qualquer pedido em Faturado, sem depender do botão.
  // Futuro: quando o SQL existir, a dataFinalizacao virá da data real de faturamento.
  const carregarRel=async()=>{
    setRelLoading(true);
    try{
      const rf=await apiFetch("/finalizados");
      let fin=(rf.data||[]);
      // Filtros: período (pela data de finalização), centro de custo e bordado
      fin=fin.filter(o=>{
        if(centro&&o.centroCusto!==centro)return false;
        if(bordadoF==="com"&&o.temBordado===false)return false;
        if(bordadoF==="sem"&&o.temBordado!==false)return false;
        const d=(o.dataFinalizacao||"").slice(0,10);
        if(de&&d&&d<de)return false;
        if(ate&&d&&d>ate)return false;
        return true;
      });
      // Atrasado = finalizado depois da data limite
      const atrasadoF=o=>{const v=dataVencimento(o);return !!(v&&o.dataFinalizacao&&new Date(o.dataFinalizacao)>new Date(v));};
      const totalFaturados=fin.length;
      const totalAtrasados=fin.filter(atrasadoF).length;
      // Agrupa por mês da finalização
      const porMes={};
      fin.forEach(o=>{
        const mes=(o.dataFinalizacao||"").slice(0,7);
        if(!mes)return;
        if(!porMes[mes])porMes[mes]={total:0,atrasados:0};
        porMes[mes].total++;
        if(atrasadoF(o))porMes[mes].atrasados++;
      });
      const faturadosPorMes=Object.entries(porMes)
        .map(([mes,v])=>({mes,total:v.total,atrasados:v.atrasados,pctAtraso:v.total?Math.round(v.atrasados/v.total*100):0}))
        .sort((a,b)=>a.mes.localeCompare(b.mes));
      // SLA médio por etapa segue vindo do Supabase (histórico de execução)
      let slaPorEtapa=[];
      try{ const rr=await apiFetch("/relatorios"+montarQuery()); slaPorEtapa=rr.slaPorEtapa||[]; }catch{}
      setRel({
        totais:{faturados:totalFaturados,faturadosAtrasados:totalAtrasados,pctAtraso:totalFaturados?Math.round(totalAtrasados/totalFaturados*100):0},
        faturadosPorMes,
        slaPorEtapa,
        finalizados:fin,
      });
    }
    catch(e){ setRel({slaPorEtapa:[],faturadosPorMes:[],totais:{}}); }
    finally{ setRelLoading(false); }
  };
  useEffect(()=>{ if(grupo==="finalizados"&&!rel){ carregarRel(); } },[grupo]);
  useEffect(()=>{ if(grupo==="programacao"&&!relProg){ carregarRelProg(); } },[grupo]);
  useEffect(()=>{ if(grupo==="previsao"&&!prev){ carregarPrev(); } },[grupo]);

  // Exporta todos os pedidos finalizados do período para Excel
  const exportarExcel=async()=>{
    setExportando(true);
    try{
      const r=await apiFetch("/finalizados");
      let lista=(r.data||[]);
      // Filtra por data de finalização dentro do intervalo + centro + bordado
      lista=lista.filter(o=>{
        if(centro&&o.centroCusto!==centro)return false;
        if(bordadoF==="com"&&o.temBordado===false)return false;
        if(bordadoF==="sem"&&o.temBordado!==false)return false;
        if(o.dataFinalizacao){
          const d=o.dataFinalizacao.slice(0,10);
          if(de&&d<de)return false;
          if(ate&&d>ate)return false;
        }
        return true;
      });
      baixarExcelFinalizados(lista,de,ate);
    }catch(e){ alert("Erro ao exportar: "+e.message); }
    finally{ setExportando(false); }
  };

  // Filtros aplicados ao "em aberto"
  const q=busca.trim().toLowerCase();
  const abertoFiltrado=(aberto||[]).filter(o=>{
    if(centro&&o.centroCusto!==centro)return false;
    if(bordadoF==="com"&&o.temBordado===false)return false;
    if(bordadoF==="sem"&&o.temBordado!==false)return false;
    if(q&&!((o.client||"").toLowerCase().includes(q)||String(o.id||"").toLowerCase().includes(q)||String(o.pedidoLinx||"").toLowerCase().includes(q)||String(o.vendasId||"").includes(q)||(o.obsProdutos||"").toLowerCase().includes(q)))return false;
    return true;
  });
  const agora=Date.now();
  const isAtrasado=o=>venceuAntes(dataVencimento(o),agora);
  const totalAberto=abertoFiltrado.length;
  const totalAtrasado=abertoFiltrado.filter(isAtrasado).length;
  const totalNoPrazo=totalAberto-totalAtrasado;
  // Lista final conforme a situação escolhida
  const listaSituacao=ordenarPorPrioridade(abertoFiltrado.filter(o=>{
    if(statusF==="atraso")return isAtrasado(o);
    if(statusF==="prazo")return !isAtrasado(o);
    return true;
  }));
  // Por etapa
  const porEtapa=etapasDoSnapshot(abertoFiltrado).map(e=>{
    // Conta por etapasAtivas, igual as telas de fila. Contar só por o.etapa
    // (a principal) fazia o Dashboard mostrar menos pedidos que a própria
    // caixa: um pedido em separação com bordado ativo tem a etapa
    // principal no bordado e sumia da linha 'Em Separação'.
    const ords=ordenarPorPrioridade(abertoFiltrado.filter(o=>(o.etapasAtivas||[o.etapa]).includes(e.nome)));
    return {etapa:e.nome,total:ords.length,atrasados:ords.filter(isAtrasado).length,ords};
  }).filter(s=>s.total>0);

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <PageH title="Dashboard" sub="Visão geral de pedidos em aberto e finalizados" onRefresh={carregar} refreshing={loading}/>
      {grupo==="aberto"&&<SnapStatus snap={snap}/>}

      {/* Alternância de grupo */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["aberto","Pedidos em Aberto"],["finalizados","Pedidos Finalizados"],["programacao","Relatório de Programação"],["previsao","Previsão de Faturamento"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setGrupo(id)}
            style={{padding:"9px 18px",borderRadius:8,border:`1.5px solid ${grupo===id?C.red:C.gray200}`,background:grupo===id?C.red:C.white,color:grupo===id?C.white:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:700}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <select value={centro} onChange={e=>setCentro(e.target.value)}
          style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none",background:C.white,cursor:"pointer",minWidth:200}}>
          <option value="">Todos os centros de custo</option>
          {CENTRO_OPTIONS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={bordadoF} onChange={e=>setBordadoF(e.target.value)}
          style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none",background:C.white,cursor:"pointer",minWidth:160}}>
          <option value="">Com e sem bordado</option>
          <option value="com">Somente com bordado</option>
          <option value="sem">Somente sem bordado</option>
        </select>
        {grupo==="aberto"&&<div style={{position:"relative",flex:1,minWidth:200,maxWidth:340}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={15} c={C.gray400}/></div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido Linx ou ID..."
            style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px 9px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>}
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>Carregando do HubSpot...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {erro}</div>}

      {/* ───── GRUPO: EM ABERTO ───── */}
      {grupo==="aberto"&&!loading&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          <div onClick={()=>setStatusF("todos")} style={{cursor:"pointer"}}>
            <Stat label="Pedidos em aberto" value={totalAberto} icon="list" active={statusF==="todos"}/>
          </div>
          <div onClick={()=>setStatusF("prazo")} style={{cursor:"pointer"}}>
            <Stat label="No prazo" value={totalNoPrazo} color={C.green} icon="check" active={statusF==="prazo"}/>
          </div>
          <div onClick={()=>setStatusF("atraso")} style={{cursor:"pointer"}}>
            <Stat label="Atrasados" value={totalAtrasado} color={C.red} icon="warn" active={statusF==="atraso"}/>
          </div>
        </div>
        <Card>
          <SecH>Pedidos por etapa</SecH>
          {porEtapa.length===0?<div style={{...F.body,color:C.gray400,fontSize:13}}>Nenhum pedido em aberto.</div>
          :<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {porEtapa.map(s=>{
              const c=STAGE_COLOR[s.etapa]||C.gray400;
              const pctAtraso=s.total?Math.round((s.atrasados/s.total)*100):0;
              return(
                <div key={s.etapa} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${C.gray100}`}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0,...F.body,fontSize:13,fontWeight:600,color:C.black}}>{s.etapa}</div>
                  {/* barra */}
                  <div style={{flex:2,minWidth:80,height:8,background:C.gray100,borderRadius:4,overflow:"hidden",display:"flex"}}>
                    <div style={{width:`${100-pctAtraso}%`,background:C.green,height:"100%"}}/>
                    <div style={{width:`${pctAtraso}%`,background:C.red,height:"100%"}}/>
                  </div>
                  <div style={{...F.body,fontSize:12,color:C.gray600,whiteSpace:"nowrap",minWidth:90,textAlign:"right"}}>
                    <strong style={{color:C.black}}>{s.total}</strong> total
                    {s.atrasados>0&&<span style={{color:C.red,fontWeight:700}}> · {s.atrasados} atrasado{s.atrasados>1?"s":""}</span>}
                  </div>
                </div>
              );
            })}
          </div>}
        </Card>

        {/* Filtro de situação + lista de pedidos */}
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {[["todos","Todos",totalAberto],["prazo","No prazo",totalNoPrazo],["atraso","Em atraso",totalAtrasado]].map(([id,lbl,n])=>{
            const ativo=statusF===id;const cor=id==="atraso"?C.red:id==="prazo"?C.green:C.gray700;
            return(
              <button key={id} onClick={()=>setStatusF(id)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:7,border:`1.5px solid ${ativo?cor:C.gray200}`,background:ativo?cor+"12":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:ativo?700:500,color:ativo?cor:C.gray600}}>
                {lbl}<span style={{background:ativo?cor:C.gray200,color:ativo?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{n}</span>
              </button>
            );
          })}
        </div>
        {listaSituacao.length===0?<div style={{...F.body,color:C.gray400,fontSize:14,textAlign:"center",padding:40,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhum pedido nesta situação.</div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
          {listaSituacao.map(o=><OCard key={(o.id||"")+o.etapa} order={o} onClick={()=>onOpen(o)} slaCfg={slaCfg}/>)}
        </div>}
      </>}

      {/* ───── GRUPO: FINALIZADOS ───── */}
      {grupo==="finalizados"&&!loading&&<>
        {/* Intervalo de datas + ações */}
        <Card>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:6}}>De (finalização)</label>
              <input type="date" value={de} onChange={e=>setDe(e.target.value)}
                style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
            </div>
            <div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:6}}>Até</label>
              <input type="date" value={ate} onChange={e=>setAte(e.target.value)}
                style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
            </div>
            <button onClick={carregarRel} disabled={relLoading}
              style={{background:relLoading?"#ccc":C.red,color:C.white,border:"none",borderRadius:8,padding:"10px 20px",cursor:relLoading?"wait":"pointer",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
              <Ic n="refresh" s={14} c={C.white}/> {relLoading?"Carregando...":"Carregar relatório"}
            </button>
            <button onClick={exportarExcel} disabled={exportando}
              style={{background:C.white,color:C.green,border:`1.5px solid ${C.green}`,borderRadius:8,padding:"10px 20px",cursor:exportando?"wait":"pointer",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
              <Ic n="download" s={14} c={C.green}/> {exportando?"Gerando...":"Exportar relatório completo"}
            </button>
          </div>
        </Card>

        {relLoading?<div style={{...F.body,color:C.gray400,fontSize:13}}>Carregando relatórios...</div>:!rel?<div style={{...F.body,color:C.gray400,fontSize:13}}>Selecione o período e clique em "Carregar relatório".</div>:<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
            <Stat label="Total faturados" value={rel.totais?.faturados||0} icon="dollar"/>
            <Stat label="Faturados com atraso" value={rel.totais?.faturadosAtrasados||0} color={C.red} icon="warn"/>
            <Stat label="% em atraso" value={(rel.totais?.pctAtraso||0)+"%"} color={(rel.totais?.pctAtraso||0)>20?C.red:C.amber} icon="clock"/>
          </div>

          <Card>
            <SecH>SLA médio por etapa</SecH>
            {(!rel.slaPorEtapa||rel.slaPorEtapa.length===0)?<div style={{...F.body,color:C.gray400,fontSize:13}}>Sem dados suficientes ainda. As médias aparecem conforme os pedidos são executados.</div>
            :<GraficoBarrasH cor={C.amber} itens={rel.slaPorEtapa.map(s=>({label:s.etapa,valor:s.mediaMin,texto:`${fmtDur(s.mediaMin)} · ${s.qtd} exec`}))}/>}
          </Card>

          <Card>
            <SecH>Faturados por mês</SecH>
            {(!rel.faturadosPorMes||rel.faturadosPorMes.length===0)?<div style={{...F.body,color:C.gray400,fontSize:13}}>Nenhum pedido faturado registrado ainda.</div>
            :<><GraficoBarrasH cor={C.green} corAtraso={C.red} itens={rel.faturadosPorMes.map(m=>{const [y,mo]=m.mes.split("-");return {label:mo?`${mo}/${y}`:m.mes,valor:m.total,atraso:m.atrasados,texto:`${m.total} faturados${m.atrasados>0?` · ${m.atrasados} em atraso`:""}`};})}/>
              <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:10,display:"flex",alignItems:"center",gap:12}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:3,background:C.green,display:"inline-block"}}/>Faturados</span>
                <span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:3,background:C.red,display:"inline-block"}}/>Em atraso</span>
              </div></>}
          </Card>

          <Card>
            <SecH>Pedidos finalizados no período ({rel.finalizados?.length||0})</SecH>
            {(!rel.finalizados||rel.finalizados.length===0)
              ?<div style={{...F.body,color:C.gray400,fontSize:13}}>Nenhum pedido finalizado no período.</div>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                {rel.finalizados.map(o=>{
                  const venc=dataVencimento(o);
                  const atrasado=!!(venc&&o.dataFinalizacao&&new Date(o.dataFinalizacao)>new Date(venc));
                  return(
                    <div key={o.id} onClick={()=>onOpen(o)} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:14,cursor:"pointer",borderLeft:`3px solid ${C.green}`}}
                      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)";}}
                      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{minWidth:0}}>
                          <div style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{idPedido(o)}</div>
                          <div style={{...F.body,fontSize:12,color:C.gray500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.client}</div>
                        </div>
                        <span style={{display:"inline-flex",alignItems:"center",background:C.green+"15",color:C.green,borderRadius:4,padding:"3px 9px",fontSize:11,fontWeight:700,...F.body,whiteSpace:"nowrap",flexShrink:0}}>FATURADO</span>
                      </div>
                      <div style={{display:"flex",gap:12,...F.body,fontSize:12,color:C.gray500,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,color:C.green}}>{fmtR(o.valor)}</span>
                        {o.temBordado===false&&<span style={{color:C.gray500,fontWeight:600}}>Sem bordado</span>}
                      </div>
                      <div style={{...F.body,fontSize:11.5,color:atrasado?C.red:C.gray600,marginTop:7,display:"flex",alignItems:"center",gap:5}}>
                        <Ic n="check" s={13} c={atrasado?C.red:C.green}/>
                        Finalizado em {o.dataFinalizacao?fmtDS(o.dataFinalizacao):"—"}{atrasado?" · com atraso":""}
                      </div>
                    </div>
                  );
                })}
              </div>}
          </Card>
        </>}
      </>}

      {/* ───── GRUPO: RELATÓRIO DE PROGRAMAÇÃO ───── */}
      {grupo==="programacao"&&<>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray500,display:"block",marginBottom:4}}>De</label>
            <input type="date" value={de} onChange={e=>setDe(e.target.value)} style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"8px 10px",...F.body,fontSize:13,outline:"none"}}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray500,display:"block",marginBottom:4}}>Até</label>
            <input type="date" value={ate} onChange={e=>setAte(e.target.value)} style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"8px 10px",...F.body,fontSize:13,outline:"none"}}/>
          </div>
          <button onClick={carregarRelProg} disabled={relProgLoading}
            style={{padding:"9px 18px",borderRadius:8,border:"none",background:C.red,color:C.white,cursor:relProgLoading?"wait":"pointer",...F.body,fontSize:13,fontWeight:700}}>
            {relProgLoading?"Carregando...":"Atualizar"}
          </button>
          <button onClick={()=>baixarExcelProgramacao(relProg||[],de,ate)} disabled={!relProg||!relProg.length}
            style={{padding:"9px 18px",borderRadius:8,border:`1.5px solid ${(!relProg||!relProg.length)?C.gray200:C.green}`,background:C.white,color:(!relProg||!relProg.length)?C.gray400:C.green,cursor:(!relProg||!relProg.length)?"not-allowed":"pointer",...F.body,fontSize:13,fontWeight:700,display:"inline-flex",alignItems:"center",gap:6}}>
            <Ic n="download" s={14} c={(!relProg||!relProg.length)?C.gray400:C.green}/> Exportar
          </button>
        </div>
        {relProgAviso&&<div style={{padding:"10px 14px",background:C.amber+"12",border:`1px solid ${C.amber}40`,borderRadius:8,...F.body,fontSize:12.5,color:"#92400e",display:"flex",alignItems:"flex-start",gap:8}}>
          <Ic n="warn" s={14} c={C.amber}/>
          <span>Não foi possível ler o relatório: <strong>{relProgAviso}</strong>. Verifique se a tabela <code>programacao_execucoes</code> existe no Supabase.</span>
        </div>}
        <Card>
          {relProgLoading
            ?<div style={{padding:24,textAlign:"center",...F.body,fontSize:13,color:C.gray500}}>Carregando...</div>
            :(!relProg||!relProg.length)
              ?<div style={{padding:24,textAlign:"center",...F.body,fontSize:13,color:C.gray500}}>Nenhuma programação registrada no período.</div>
              :<div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",...F.body,fontSize:13}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${C.gray200}`}}>
                      {["Arquivo","Programador","Dificuldade","Data da execução"].map(h=>(
                        <th key={h} style={{textAlign:"left",padding:"10px 12px",...F.body,fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {relProg.map((r,i)=>{
                      const cor=r.dificuldade==="Difícil"?C.red:r.dificuldade==="Médio"?C.amber:C.green;
                      return(
                        <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                          <td style={{padding:"10px 12px",color:C.black,fontWeight:600,wordBreak:"break-word"}}>{r.nome_arquivo}</td>
                          <td style={{padding:"10px 12px",color:C.gray700,fontWeight:600}}>{r.programador||"—"}</td>
                          <td style={{padding:"10px 12px"}}><span style={{background:cor+"14",color:cor,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{r.dificuldade||"—"}</span></td>
                          <td style={{padding:"10px 12px",color:C.gray600}}>{r.data_execucao?fmtDS(r.data_execucao):"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{padding:"10px 12px",...F.body,fontSize:12,color:C.gray500,borderTop:`1px solid ${C.gray100}`}}>Total: {relProg.length} bordado(s) programado(s) no período.</div>
              </div>}
        </Card>
      </>}

      {grupo==="previsao"&&<>
        {prevLoading&&!prev&&<Card><div style={{padding:24,textAlign:"center",...F.body,fontSize:13,color:C.gray500}}>Carregando previsão...</div></Card>}
        {prev&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
            <Stat label="Faturado no mês" value={fmtR(prev.totalFaturadoMes)} color={C.green} icon="dollar"/>
            <Stat label="Previsão por vencimento (mês)" value={fmtR(Object.values(prev.vencimentoDia||{}).reduce((s,v)=>s+v,0))} color={C.red} icon="clock"/>
            <Stat label="Média por dia útil" value={fmtR(prev.diasUteisDecorridos>0?prev.totalFaturadoMes/prev.diasUteisDecorridos:0)} color={C.amber} icon="chart"/>
            <Stat label="Dias úteis" value={`${prev.diasUteisDecorridos}/${prev.diasUteisMes}`} icon="check"/>
          </div>
          <GraficoPrevisao data={prev}/>
        </>}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button onClick={carregarPrev} disabled={prevLoading} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${C.gray200}`,background:C.white,color:C.gray600,cursor:prevLoading?"wait":"pointer",...F.body,fontSize:13,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}>
            <Ic n="refresh" s={14} c={C.gray500}/> {prevLoading?"Atualizando...":"Atualizar"}
          </button>
        </div>
      </>}
    </div>
  );
}
function TodosPedidos({onOpen,slaCfg,initialBusca}){
  const [busca,setBusca]=useState(initialBusca||"");
  // Atualiza a busca quando vier de uma notificação
  useEffect(()=>{ if(initialBusca)setBusca(initialBusca); },[initialBusca]);
  const [centro,setCentro]=useState("");
  const [bordadoF,setBordadoF]=useState("");    // "" | com | sem
  const [statusF,setStatusF]=useState("todos");  // todos | prazo | atraso

  const snap = useSnapshotAberto();
  const aberto = useMemo(() => snapTodosPedidos(snap.data).map(o => normalizarCard(o, o.etapa)), [snap.data]);
  const loading = snap.loading && !snap.data;
  const erro = snap.error;
  const carregar = snap.refresh;

  const agora=Date.now();
  const isAtrasado=o=>venceuAntes(dataVencimento(o),agora);
  const q=busca.trim().toLowerCase();
  const filtrados=(aberto||[]).filter(o=>{
    if(centro&&o.centroCusto!==centro)return false;
    if(bordadoF==="com"&&o.temBordado===false)return false;
    if(bordadoF==="sem"&&o.temBordado!==false)return false;
    if(statusF==="atraso"&&!isAtrasado(o))return false;
    if(statusF==="prazo"&&isAtrasado(o))return false;
    if(q){
      const alvo=((o.client||"")+" "+(o.id||"")+" "+(o.razaoSocial||"")+" "+(o.pedidoLinx||"")+" "+(o.vendasId||"")).toLowerCase();
      if(!alvo.includes(q))return false;
    }
    return true;
  });
  const total=filtrados.length;
  const atrasados=filtrados.filter(isAtrasado).length;
  // Agrupado por fase (etapa), na ordem do fluxo. Como um mesmo pedido pode
  // aparecer em VÁRIAS etapas (via etapasAtivas do worker), a contagem geral
  // acima (total) é única por vendasId. Cada agrupamento por etapa usa
  // etapasAtivas.includes(nome) — assim um card em separação + programação
  // aparece nas duas seções.
  const perteceEtapa = (o, nome) => (o.etapasAtivas||[o.etapa]).includes(nome);
  const porEtapa=etapasDoSnapshot(filtrados).map(e=>({
    etapa:e.nome,
    ords:ordenarPorPrioridade(filtrados.filter(o=>perteceEtapa(o,e.nome))),
  })).filter(s=>s.ords.length>0);

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
      <PageH title="Pedidos em Aberto" sub="Acompanhe em qual fase cada pedido em aberto está" onRefresh={carregar} refreshing={loading}/>
      <SnapStatus snap={snap}/>

      {/* Busca em destaque */}
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={17} c={C.gray400}/></div>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido Linx ou ID HubSpot..."
          style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:10,padding:"12px 14px 12px 42px",...F.body,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {/* Filtros */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <select value={centro} onChange={e=>setCentro(e.target.value)}
          style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none",background:C.white,cursor:"pointer",minWidth:190}}>
          <option value="">Todos os centros de custo</option>
          {CENTRO_OPTIONS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={bordadoF} onChange={e=>setBordadoF(e.target.value)}
          style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none",background:C.white,cursor:"pointer",minWidth:150}}>
          <option value="">Com e sem bordado</option>
          <option value="com">Somente com bordado</option>
          <option value="sem">Somente sem bordado</option>
        </select>
      </div>

      {/* Situação */}
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {[["todos","Todos",total],["prazo","No prazo",total-atrasados],["atraso","Em atraso",atrasados]].map(([id,lbl,n])=>{
          const ativo=statusF===id;const cor=id==="atraso"?C.red:id==="prazo"?C.green:C.gray700;
          return(
            <button key={id} onClick={()=>setStatusF(id)}
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:7,border:`1.5px solid ${ativo?cor:C.gray200}`,background:ativo?cor+"12":C.white,cursor:"pointer",...F.body,fontSize:12.5,fontWeight:ativo?700:500,color:ativo?cor:C.gray600}}>
              {lbl}<span style={{background:ativo?cor:C.gray200,color:ativo?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{n}</span>
            </button>
          );
        })}
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>Carregando do HubSpot...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {erro}</div>}

      {!loading&&porEtapa.length===0&&(
        <div style={{textAlign:"center",padding:60,...F.body,color:C.gray400,fontSize:14,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          Nenhum pedido encontrado para esta busca/filtro.
        </div>
      )}

      {/* Pedidos agrupados por fase */}
      {porEtapa.map(s=>(
        <div key={s.etapa}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,marginTop:2}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:STAGE_COLOR[s.etapa]||C.gray400,flexShrink:0}}/>
            <span style={{...F.title,fontSize:12.5,fontWeight:700,letterSpacing:"0.07em"}}>{s.etapa.toUpperCase()}</span>
            <span style={{...F.body,fontSize:12,color:C.gray400}}>({s.ords.length})</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {s.ords.map(o=><OCard key={(o.id||"")+s.etapa} order={o} onClick={()=>onOpen({...o,_etapaOrigem:s.etapa})} slaCfg={slaCfg}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FUNIL EM TEMPO REAL ──────────────────────────────────────────────────────
function Funil({onOpen,slaCfg}){
  const [sel,setSel]=useState(null);
  const snap = useSnapshotAberto();
  const aberto = useMemo(() => snapTodosPedidos(snap.data).map(o => normalizarCard(o, o.etapa)), [snap.data]);
  const loading = snap.loading && !snap.data;
  const erro = snap.error;
  const carregar = snap.refresh;

  const agora=Date.now();
  const isAtrasado=o=>venceuAntes(o.dataVencimento,agora);
  const stats=etapasDoSnapshot(aberto).map(e=>{
    const ords=ordenarPorPrioridade((aberto||[]).filter(o=>(o.etapasAtivas||[o.etapa]).includes(e.nome)));
    const atrasados=ords.filter(isAtrasado).length;
    return{
      etapa:e.nome,count:ords.length,
      val:ords.reduce((s,o)=>s+(o.valor||0),0),
      atrasados,pctAtraso:ords.length?Math.round((atrasados/ords.length)*100):0,
      ords,
    };
  }).filter(s=>s.count>0);

  const totalAberto=stats.reduce((s,x)=>s+x.count,0);
  const totalValor=stats.reduce((s,x)=>s+x.val,0);

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Funil em Tempo Real" sub="Pedidos em aberto por etapa, com atrasos e valor" onRefresh={carregar} refreshing={loading}/>
      <SnapStatus snap={snap}/>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>Carregando do HubSpot...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {erro}</div>}

      {!loading&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          <Stat label="Pedidos em aberto" value={totalAberto} icon="list"/>
          <Stat label="Valor total em aberto" value={fmtR(totalValor)} color={C.green} icon="dollar"/>
        </div>

        {stats.length===0?<div style={{...F.body,color:C.gray400,fontSize:14,textAlign:"center",padding:60,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhum pedido em aberto no momento.</div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
          {stats.map(s=>{
            const c=STAGE_COLOR[s.etapa]||C.gray500;const isSel=sel===s.etapa;
            return(
              <div key={s.etapa} onClick={()=>setSel(isSel?null:s.etapa)}
                style={{background:C.white,border:`1.5px solid ${isSel?c:C.gray200}`,borderRadius:8,padding:16,cursor:"pointer"}}
                onMouseEnter={e=>{if(!isSel)e.currentTarget.style.borderColor=c+"80";}}
                onMouseLeave={e=>{if(!isSel)e.currentTarget.style.borderColor=C.gray200;}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:c,marginBottom:6}}/>
                    <div style={{...F.title,fontSize:11,fontWeight:700,color:C.black,letterSpacing:"0.06em"}}>{s.etapa.toUpperCase()}</div>
                  </div>
                  <div style={{...F.title,fontSize:26,fontWeight:700,color:c,marginLeft:8}}>{s.count}</div>
                </div>
                {/* barra no prazo vs atraso */}
                <div style={{height:8,background:C.gray100,borderRadius:4,overflow:"hidden",display:"flex",marginBottom:10}}>
                  <div style={{width:`${100-s.pctAtraso}%`,background:C.green,height:"100%"}}/>
                  <div style={{width:`${s.pctAtraso}%`,background:C.red,height:"100%"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...F.body,fontSize:12}}>
                    <span style={{color:C.gray500,display:"flex",alignItems:"center",gap:4}}><Ic n="warn" s={11} c={s.atrasados>0?C.red:C.gray400}/>Atrasados</span>
                    <span style={{fontWeight:700,color:s.atrasados>0?C.red:C.gray600}}>{s.atrasados} ({s.pctAtraso}%)</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...F.body,fontSize:12}}>
                    <span style={{color:C.gray500,display:"flex",alignItems:"center",gap:4}}><Ic n="dollar" s={11} c={C.gray400}/>Valor</span>
                    <span style={{fontWeight:700,color:C.green}}>{fmtR(s.val)}</span>
                  </div>
                </div>
                <div style={{...F.body,fontSize:11,color:isSel?c:C.gray400,fontWeight:600,textAlign:"center",marginTop:10}}>{isSel?"▲ Fechar":"▼ Ver pedidos"}</div>
              </div>
            );
          })}
        </div>}

        {sel&&<Card style={{border:`1px solid ${STAGE_COLOR[sel]||C.gray200}40`}}>
          <SecH>{sel} — pedidos em aberto (por prioridade)</SecH>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {stats.find(s=>s.etapa===sel)?.ords.map(o=><OCard key={(o.id||"")+o.etapa} order={o} onClick={()=>onOpen(o)} slaCfg={slaCfg}/>)}
          </div>
        </Card>}
      </>}
    </div>
  );
}

// ─── GERENCIAL ───────────────────────────────────────────────────────────────
function Gerencial({isMobile}){
  const[p,setP]=useState("semana");
  const PC=[C.red,C.green,C.amber];
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"flex-start"}}>
        <PageH title="Gerencial" sub="Indicadores de performance do setor"/>
        <div style={{display:"flex",gap:6}}>
          {["semana","mes","trimestre"].map(v=>(
            <button key={v} onClick={()=>setP(v)} style={{background:p===v?C.red:C.white,color:p===v?C.white:C.gray600,border:`1px solid ${p===v?C.red:C.gray200}`,borderRadius:6,padding:"7px 14px",...F.body,fontSize:12,fontWeight:600,cursor:"pointer"}}>
              {v==="semana"?"Semana":v==="mes"?"Mês":"Trimestre"}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="Entrados" value="42" icon="inbox"/>
        <Stat label="Concluídos" value="37" color={C.green} icon="check"/>
        <Stat label="Tempo Médio" value="4.2d" color={C.amber} icon="clock"/>
        <Stat label="Retrabalho" value="8%" color={C.red} icon="refresh"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        <Card>
          <SecH>Pedidos por Etapa</SecH>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GER_DATA.etapas} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/><XAxis dataKey="e" tick={{fontSize:9,fill:C.gray500}}/><YAxis tick={{fontSize:9,fill:C.gray500}}/><Tooltip contentStyle={{fontSize:12}}/><Bar dataKey="q" fill={C.red} radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SecH>Tempo Médio por Etapa (horas)</SecH>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GER_DATA.tempo} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/><XAxis dataKey="e" tick={{fontSize:9,fill:C.gray500}}/><YAxis tick={{fontSize:9,fill:C.gray500}}/><Tooltip contentStyle={{fontSize:12}} formatter={v=>`${v}h`}/><Bar dataKey="h" fill={C.green} radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SecH>Volume Semanal — Entradas vs Saídas</SecH>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={GER_DATA.semanal}><CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/><XAxis dataKey="d" tick={{fontSize:11,fill:C.gray500}}/><YAxis tick={{fontSize:11,fill:C.gray500}}/><Tooltip contentStyle={{fontSize:12}}/><Line type="monotone" dataKey="e" stroke={C.red} strokeWidth={2} dot={{r:3}} name="Entradas"/><Line type="monotone" dataKey="s" stroke={C.green} strokeWidth={2} dot={{r:3}} name="Saídas"/></LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SecH>Distribuição por Tipo</SecH>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart><Pie data={GER_DATA.dist} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="v">{GER_DATA.dist.map((_,i)=><Cell key={i} fill={PC[i]}/>)}</Pie><Tooltip contentStyle={{fontSize:12}}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {GER_DATA.dist.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,...F.body,fontSize:12}}><div style={{width:10,height:10,borderRadius:2,background:PC[i],flexShrink:0}}/><span style={{color:C.gray600}}>{d.n}</span><span style={{fontWeight:700}}>{d.v}%</span></div>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── HISTÓRICO ───────────────────────────────────────────────────────────────
function Historico({hist,onOpen}){
  const[df,setDf]=useState("");const[dt,setDt]=useState("");const[vnd,setVnd]=useState("");
  const filtered=hist.filter(o=>{
    if(df&&new Date(o.dataConclusao)<new Date(df))return false;
    if(dt&&new Date(o.dataConclusao)>new Date(dt+"T23:59:59"))return false;
    if(vnd&&!o.vendedor.toLowerCase().includes(vnd.toLowerCase()))return false;
    return true;
  });
  const totalVal=filtered.reduce((s,o)=>s+o.valor,0);
  const cum=filtered.filter(o=>o.cumpriunSLA).length;
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Histórico" sub="Pedidos concluídos com filtro por período"/>
      <Card>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[["De",df,setDf,"date"],["Até",dt,setDt,"date"],["Vendedor",vnd,setVnd,"text"]].map(([lbl,val,set,type])=>(
            <div key={lbl}>
              <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>{lbl}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={type==="text"?"Filtrar...":undefined}
                style={{border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
            </div>
          ))}
          <Btn label="Limpar" variant="secondary" onClick={()=>{setDf("");setDt("");setVnd("");}}/>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="Pedidos" value={filtered.length} icon="list" color={C.blue}/>
        <Stat label="Valor Total" value={"R$"+Math.round(totalVal/1000)+"k"} icon="dollar" color={C.green}/>
        <Stat label="SLA Cumprido" value={`${filtered.length?Math.round(cum/filtered.length*100):0}%`} icon="check" color={cum/filtered.length>=0.8?C.green:C.red}/>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:540}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["Pedido","Cliente","Vendedor","Valor","Conclusão","Prazo","SLA"].map(hd=><th key={hd} style={{padding:"11px 14px",textAlign:"left",...F.body,fontSize:11,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{hd}</th>)}
            </tr></thead>
            <tbody>{filtered.map(o=>(
              <tr key={o.id} onClick={()=>onOpen(o)} style={{borderBottom:`1px solid ${C.gray100}`,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                <td style={{padding:"10px 14px",fontWeight:700,...F.body}}>{idPedido(o)}</td>
                <td style={{padding:"10px 14px",...F.body,color:C.gray700}}>{o.client}</td>
                <td style={{padding:"10px 14px",...F.body,color:C.gray500}}>{o.vendedor}</td>
                <td style={{padding:"10px 14px",fontWeight:700,...F.body,color:C.green}}>{fmtR(o.valor)}</td>
                <td style={{padding:"10px 14px",...F.body,color:C.gray500}}>{fmtDS(o.dataConclusao)}</td>
                <td style={{padding:"10px 14px",fontWeight:600,...F.body,color:new Date(o.prazoFinal)<new Date(o.dataConclusao)?C.red:C.green}}>{fmtDS(o.prazoFinal)}</td>
                <td style={{padding:"10px 14px"}}><Tag label={o.cumpriunSLA?"Cumprido":"Atrasado"} color={o.cumpriunSLA?C.green:C.red}/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── RANKING ─────────────────────────────────────────────────────────────────
function Ranking({hist}){
  const[df,setDf]=useState("");const[dt,setDt]=useState("");
  const filtered=hist.filter(o=>{
    if(df&&new Date(o.dataConclusao)<new Date(df))return false;
    if(dt&&new Date(o.dataConclusao)>new Date(dt+"T23:59:59"))return false;
    return true;
  });
  const byV={},byR={};
  filtered.forEach(o=>{
    if(!byV[o.vendedor])byV[o.vendedor]={n:o.vendedor,p:0,v:0,c:0};
    byV[o.vendedor].p++;byV[o.vendedor].v+=o.valor;if(o.cumpriunSLA)byV[o.vendedor].c++;
    const r=o.resp||"—";
    if(!byR[r])byR[r]={n:r,p:0,v:0,c:0};
    byR[r].p++;byR[r].v+=o.valor;if(o.cumpriunSLA)byR[r].c++;
  });
  const vRank=Object.values(byV).sort((a,b)=>b.v-a.v);
  const rRank=Object.values(byR).sort((a,b)=>b.p-a.p);
  const medals=["1º","2º","3º"];const mc=[C.amber,C.gray500,"#cd7f32"];
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Ranking / Premiação" sub="Performance por vendedor e executor no período"/>
      <Card>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[["De",df,setDf],["Até",dt,setDt]].map(([lbl,val,set])=>(
            <div key={lbl}>
              <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>{lbl}</label>
              <input type="date" value={val} onChange={e=>set(e.target.value)} style={{border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
            </div>
          ))}
          <Btn label="Limpar" variant="secondary" onClick={()=>{setDf("");setDt("");}}/>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[["Vendedores — Faturamento",vRank,"v"],["Executores — Pedidos",rRank,"p"]].map(([title,rank,metric])=>(
          <Card key={title}>
            <SecH>{title}</SecH>
            {rank.length===0?<div style={{...F.body,color:C.gray400,fontSize:13}}>Sem dados no período.</div>
              :rank.map((v,i)=>(
                <div key={v.n} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<rank.length-1?`1px solid ${C.gray100}`:"none"}}>
                  <div style={{width:28,...F.title,fontSize:14,fontWeight:700,color:mc[i]||C.gray400,textAlign:"center",flexShrink:0}}>{medals[i]||`${i+1}º`}</div>
                  <div style={{flex:1}}>
                    <div style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{v.n}</div>
                    <div style={{...F.body,fontSize:11,color:C.gray400}}>{v.p} pedidos · {Math.round(v.c/v.p*100)}% SLA</div>
                  </div>
                  <div style={{...F.title,fontWeight:700,fontSize:15,color:C.green}}>{metric==="v"?fmtR(v.v):`${v.p} ped.`}</div>
                </div>
              ))
            }
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SLA CONFIG ──────────────────────────────────────────────────────────────
function SLAConfig({slaCfg,onSave,user}){
  const[local,setLocal]=useState({...slaCfg});
  const[prazoCom,setPrazoCom]=useState(15);
  const[prazoSem,setPrazoSem]=useState(7);
  const[cap,setCap]=useState({interno:0,bordadel:0,mg_bordados:0,outros:0});
  const[senhaExp,setSenhaExp]=useState("");
  const[temSenhaExp,setTemSenhaExp]=useState(false);
  const[feriados,setFeriados]=useState([]);
  const[novoFeriado,setNovoFeriado]=useState("");
  const[emit,setEmit]=useState({razaoSocial:"",cnpj:"",endereco:"",logoUrl:""});
  const[saved,setSaved]=useState(false);
  const[saving,setSaving]=useState(false);
  const[loading,setLoading]=useState(true);

  // Carrega a config persistida do Worker (KV)
  useEffect(()=>{
    apiFetch("/config-sla").then(r=>{
      if(r.success&&r.config){
        if(r.config.etapas)setLocal(prev=>({...prev,...r.config.etapas}));
        if(r.config.prazoComBordado!=null)setPrazoCom(r.config.prazoComBordado);
        if(r.config.prazoSemBordado!=null)setPrazoSem(r.config.prazoSemBordado);
        if(r.config.capacidade)setCap(prev=>({...prev,...r.config.capacidade}));
        setTemSenhaExp(!!r.config.temSenhaExpedicao);
        if(Array.isArray(r.config.feriados))setFeriados(r.config.feriados);
        if(r.config.emitente)setEmit(prev=>({...prev,...r.config.emitente}));
      }
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const addFeriado=()=>{ const d=(novoFeriado||"").slice(0,10); if(!d) return; setFeriados(prev=>prev.includes(d)?prev:[...prev,d].sort()); setNovoFeriado(""); };
  const removeFeriado=(d)=>setFeriados(prev=>prev.filter(x=>x!==d));

  const save=async()=>{
    setSaving(true);
    try{
      const payload={etapas:local,prazoComBordado:Number(prazoCom),prazoSemBordado:Number(prazoSem),capacidade:{interno:Number(cap.interno||0),bordadel:Number(cap.bordadel||0),mg_bordados:Number(cap.mg_bordados||0),outros:Number(cap.outros||0)},feriados,emitente:emit};
      if(senhaExp.trim()) payload.senhaDesbloqueioExpedicao=senhaExp.trim();
      await apiFetch("/config-sla","PATCH",payload);
      if(senhaExp.trim()){setTemSenhaExp(true);setSenhaExp("");}
      onSave(local);
      setSaved(true);setTimeout(()=>setSaved(false),2000);
    }catch(e){alert("Erro ao salvar: "+e.message);}
    finally{setSaving(false);}
  };

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <PageH title="Configurações" sub="Tempo máximo por etapa e prazos de vencimento dos pedidos"/>

      {/* Prazos de vencimento (data de vencimento do pedido) */}
      <Card>
        <SecH>Prazo de faturamento (data de vencimento)</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:16}}>
          Define a <strong>data de vencimento</strong> de cada pedido, usada para priorizar a ordem em todos os módulos. Para pedidos <strong>com bordado</strong>, o prazo é contado a partir da aprovação da amostra física. Para pedidos <strong>sem bordado</strong>, a partir da criação do pedido.
        </div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Pedido com bordado</label>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="number" value={prazoCom} onChange={e=>setPrazoCom(e.target.value)}
                style={{width:80,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
              <span style={{...F.body,fontSize:12,color:C.gray400}}>dias</span>
            </div>
          </div>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Pedido sem bordado</label>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="number" value={prazoSem} onChange={e=>setPrazoSem(e.target.value)}
                style={{width:80,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
              <span style={{...F.body,fontSize:12,color:C.gray400}}>dias</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Capacidade produtiva por destino de bordado (em peças) */}
      <Card>
        <SecH>Capacidade produtiva (peças)</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:16}}>
          Volume máximo de <strong>peças com bordado em aberto</strong> que cada destino comporta. Usado para sugerir o direcionamento (prioridade: Interno → Bordadel → MG Bordados → Outros).
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16}}>
          {[["interno","Interno",C.green],["bordadel","Bordadel",C.red],["mg_bordados","MG Bordados","#7c3aed"],["outros","Outros",C.amber]].map(([k,lbl,cor])=>(
            <div key={k}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <span style={{width:10,height:10,borderRadius:3,background:cor,display:"inline-block"}}/>
                <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lbl}</label>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" min="0" value={cap[k]} onChange={e=>setCap(prev=>({...prev,[k]:e.target.value}))}
                  style={{width:90,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
                <span style={{...F.body,fontSize:12,color:C.gray400}}>peças</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Senha do cadeado de desbloqueio manual (Expedição) */}
      <Card>
        <SecH>Senha de desbloqueio da bipagem (Expedição)</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:14}}>
          Senha do <strong>cadeado</strong> na conferência da Expedição. Quem tiver a senha consegue informar a quantidade conferida manualmente por produto, caso o leitor falhe. {temSenhaExp
            ? <span style={{color:C.green,fontWeight:600}}>✓ Senha configurada.</span>
            : <span style={{color:C.amber,fontWeight:600}}>Nenhuma senha definida ainda — o desbloqueio manual fica indisponível até definir uma.</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <input type="password" value={senhaExp} onChange={e=>setSenhaExp(e.target.value)} placeholder={temSenhaExp?"Digite para alterar a senha":"Defina uma senha"}
            style={{width:260,maxWidth:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"9px 12px",...F.body,fontSize:13,outline:"none"}}/>
          <span style={{...F.body,fontSize:11,color:C.gray400}}>Deixe em branco para manter a atual.</span>
        </div>
      </Card>

      {/* Feriados (para dias úteis na Previsão de Faturamento) */}
      <Card>
        <SecH>Feriados</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:14}}>
          Datas consideradas <strong>não úteis</strong> no cálculo da Previsão de Faturamento (média por dia útil). Fins de semana já são excluídos automaticamente.
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <input type="date" value={novoFeriado} onChange={e=>setNovoFeriado(e.target.value)}
            style={{border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
          <button onClick={addFeriado} style={{background:C.green,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:13,...F.body,display:"flex",alignItems:"center",gap:6}}>
            <Ic n="check" s={14} c={C.white}/> Adicionar
          </button>
        </div>
        {feriados.length===0
          ?<div style={{...F.body,fontSize:13,color:C.gray400}}>Nenhum feriado cadastrado.</div>
          :<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {feriados.map(d=>(
              <span key={d} style={{display:"inline-flex",alignItems:"center",gap:8,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:20,padding:"6px 8px 6px 14px",...F.body,fontSize:13,fontWeight:600,color:C.gray700}}>
                {d.split("-").reverse().join("/")}
                <button onClick={()=>removeFeriado(d)} title="Remover" style={{background:C.red+"14",color:C.red,border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,lineHeight:1}}>×</button>
              </span>
            ))}
          </div>}
      </Card>

      {/* Dados da Citerol (emitente) para a Impressão de Pedido */}
      <Card>
        <SecH>Dados da Citerol (cabeçalho da impressão)</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:16}}>
          Aparecem no topo de cada folha de separação. Os dados do cliente saem automaticamente do próprio pedido.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {[["razaoSocial","Razão social"],["cnpj","CNPJ"],["endereco","Endereço"],["logoUrl","URL do logo (opcional)"]].map(([k,l])=>(
            <div key={k} style={k==="endereco"||k==="logoUrl"?{gridColumn:"1 / -1"}:{}}>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:6}}>{l}</label>
              <input value={emit[k]||""} onChange={e=>setEmit(prev=>({...prev,[k]:e.target.value}))} placeholder={k==="logoUrl"?"https://...":""}
                style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
        </div>
        {emit.logoUrl&&<div style={{marginTop:12}}><img src={emit.logoUrl} alt="logo" style={{height:44,objectFit:"contain"}}/></div>}
      </Card>

      {/* Tempo por etapa */}
      <Card>
        <SecH>Tempo máximo por etapa</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:20}}>Pedidos que ultrapassarem o tempo definido serão sinalizados como atrasados na etapa.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {Object.keys(SLA_DEF).map(e=>(
            <div key={e}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLOR[e]||C.gray400}}/>
                <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{e}</label>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={local[e]||""} onChange={ev=>setLocal({...local,[e]:Number(ev.target.value)})}
                  style={{width:80,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
                <span style={{...F.body,fontSize:12,color:C.gray400}}>horas</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Responsável Pós-Venda (quem atende quem) — salva separado */}
      <ConfigRespPosVenda/>

      {/* Manutenção — ações administrativas */}
      <Card>
        <SecH>Manutenção</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:16}}>Ações administrativas para corrigir problemas de dados no HubSpot.</div>
        <BackfillLinxBtn/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <BackfillVencimentoBtn/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <BackfillVencimentoSemBordadoBtn/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <FinalizarLoteBtn user={user}/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <CorrigirPersonalizacaoBtn user={user}/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <MigrarReprogFisicaBtn/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <MigrarBonificacoesBtn/>
        <div style={{height:1,background:C.gray100,margin:"18px 0"}}/>
        <MonitorSemPosvendaBtn/>
      </Card>

      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <Btn label={saving?"Salvando...":"Salvar configurações"} icon="check" onClick={save}/>
        {saved&&<span style={{...F.body,fontSize:13,color:C.green,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Ic n="check" s={14} c={C.green}/>Salvo!</span>}
        {loading&&<span style={{...F.body,fontSize:12,color:C.gray400}}>Carregando config...</span>}
      </div>
    </div>
  );
}

// Gestão "quem atende quem" — responsável de pós-venda por vendedor(a). Salva no
// KV via /config-responsavel-posvenda. O SGP cruza pelo nome do representante.
function ConfigRespPosVenda(){
  const [mapa,setMapa]=useState({});
  const [carregando,setCarregando]=useState(true);
  const [salvando,setSalvando]=useState(false);
  const [ok,setOk]=useState(false);
  const [novoResp,setNovoResp]=useState("");
  const [novoVend,setNovoVend]=useState({}); // {resp: texto}
  useEffect(()=>{ apiFetch("/config-responsavel-posvenda").then(r=>{ if(r&&r.success) setMapa(r.mapa||{}); }).catch(()=>{}).finally(()=>setCarregando(false)); },[]);
  const addResp=()=>{ const n=novoResp.trim(); if(!n) return; setMapa(m=>m[n]?m:{...m,[n]:[]}); setNovoResp(""); };
  const rmResp=(r)=>setMapa(m=>{const c={...m};delete c[r];return c;});
  const addVend=(r)=>{ const v=(novoVend[r]||"").trim(); if(!v) return; setMapa(m=>({...m,[r]:[...(m[r]||[]).filter(x=>x.toLowerCase()!==v.toLowerCase()),v]})); setNovoVend(p=>({...p,[r]:""})); };
  const rmVend=(r,v)=>setMapa(m=>({...m,[r]:(m[r]||[]).filter(x=>x!==v)}));
  const salvar=async()=>{ setSalvando(true); try{ await apiFetch("/config-responsavel-posvenda","POST",{mapa}); _respPVMap=mapa; _rebuildRespPVIndex(); _respPVListeners.forEach(fn=>{try{fn();}catch(e){}}); setOk(true); setTimeout(()=>setOk(false),2500);}catch(e){alert("Erro ao salvar: "+e.message);} finally{setSalvando(false);} };
  const resps=Object.keys(mapa);
  return (
    <Card>
      <SecH>Responsável Pós-Venda (quem atende quem)</SecH>
      <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:14}}>Vincule cada responsável de pós-venda aos vendedores(as) que ela atende. O SGP cruza pelo <strong>nome do representante</strong> e exibe o responsável em todos os pedidos.</div>
      {carregando?<div style={{...F.body,fontSize:13,color:C.gray400}}>Carregando...</div>:<>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input value={novoResp} onChange={e=>setNovoResp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addResp()} placeholder="Nome do responsável (ex.: Karolyne Marques)" style={{flex:1,border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none"}}/>
          <button onClick={addResp} style={{background:C.red,color:C.white,border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",...F.body,fontWeight:700,fontSize:13}}>+ Responsável</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {resps.length===0&&<div style={{...F.body,fontSize:13,color:C.gray400}}>Nenhum responsável cadastrado ainda.</div>}
          {resps.map(r=>(
            <div key={r} style={{border:`1px solid ${C.gray200}`,borderRadius:10,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{...F.body,fontSize:14,fontWeight:800,color:"#7c3aed"}}>{r}</span>
                <button onClick={()=>rmResp(r)} style={{background:"none",border:"none",color:C.gray400,cursor:"pointer",...F.body,fontSize:12,textDecoration:"underline"}}>Remover</button>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {(mapa[r]||[]).map(v=>(
                  <span key={v} style={{display:"inline-flex",alignItems:"center",gap:6,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"5px 9px",...F.body,fontSize:12,color:C.gray700}}>{v}<button onClick={()=>rmVend(r,v)} style={{background:"none",border:"none",color:C.gray400,cursor:"pointer",fontSize:14,lineHeight:1}}>✕</button></span>
                ))}
                {(mapa[r]||[]).length===0&&<span style={{...F.body,fontSize:12,color:C.gray400}}>Nenhum vendedor vinculado.</span>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input value={novoVend[r]||""} onChange={e=>setNovoVend(p=>({...p,[r]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addVend(r)} placeholder="Nome do vendedor(a)" style={{flex:1,border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"8px 11px",...F.body,fontSize:12,outline:"none"}}/>
                <button onClick={()=>addVend(r)} style={{background:C.white,color:C.red,border:`1.5px solid ${C.red}`,borderRadius:7,padding:"8px 13px",cursor:"pointer",...F.body,fontWeight:700,fontSize:12}}>+ Vendedor</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginTop:16}}>
          <button onClick={salvar} disabled={salvando} style={{background:salvando?C.gray300:C.red,color:C.white,border:"none",borderRadius:8,padding:"11px 22px",cursor:salvando?"wait":"pointer",...F.body,fontWeight:700,fontSize:13,display:"inline-flex",alignItems:"center",gap:8}}><Ic n="check" s={14} c={C.white}/> {salvando?"Salvando...":"Salvar responsáveis"}</button>
          {ok&&<span style={{...F.body,fontSize:13,color:C.green,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}><Ic n="check" s={14} c={C.green}/>Salvo!</span>}
        </div>
      </>}
    </Card>
  );
}

// Botão que roda o backfill de id_negocio_vendas nos deals de bordado órfãos.
// Resolve o caso de cards de Programação/Amostra/Bordado que não mostram o
// número do Linx porque foram criados manualmente (sem passar pela automação).
function BackfillLinxBtn(){
  const [rodando,setRodando]=useState(false);
  const [resultado,setResultado]=useState(null);
  const [erro,setErro]=useState("");
  const rodar=async()=>{
    if(!confirm("Rodar backfill agora? Vai preencher a propriedade id_negocio_vendas nos deals de bordado que estão sem ela. Costuma levar alguns segundos e é seguro rodar quantas vezes precisar."))return;
    setRodando(true);setResultado(null);setErro("");
    try{
      const r=await apiFetch("/backfill-id-negocio-vendas","POST",{});
      if(r.success){
        setResultado(r);
      } else {
        setErro(r.error||"Erro desconhecido");
      }
    }catch(e){setErro(e.message||"Falha na requisição");}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Preencher LINX em cards de Programação/Bordado
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Alguns cards do pipeline de bordado ficam sem o número do Linx porque foram criados manualmente.
          Este botão descobre o negócio de Vendas de cada um e preenche a propriedade <code>id_negocio_vendas</code>.
          Pode rodar sempre que quiser — é idempotente.
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={rodar} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,
          display:"inline-flex",alignItems:"center",gap:7
        }}>
          {rodando?"Rodando...":"Rodar backfill agora"}
        </button>
        {resultado&&<span style={{...F.body,fontSize:12,color:C.green,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>
          <Ic n="check" s={13} c={C.green}/>
          {resultado.atualizados!=null
            ? `Concluído: ${resultado.atualizados} atualizados${resultado.encontrados!=null?" de "+resultado.encontrados+" órfãos":""}`
            : "Concluído com sucesso"}
        </span>}
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
    </div>
  );
}

// Botão que preenche a data_vencimento retroativa dos pedidos COM bordado já
// aprovados. Roda em LOTES (pra caber no plano grátis) até acabar, mostrando
// o progresso. Idempotente — pode rodar quantas vezes quiser.
function BackfillVencimentoBtn(){
  const [rodando,setRodando]=useState(false);
  const [feitos,setFeitos]=useState(0);
  const [restam,setRestam]=useState(null);
  const [msg,setMsg]=useState("");
  const [erro,setErro]=useState("");
  const rodar=async()=>{
    if(!confirm("Preencher o vencimento retroativo dos pedidos com bordado já aprovados? Roda em lotes até terminar (pode levar alguns minutos). É seguro e idempotente."))return;
    setRodando(true);setErro("");setMsg("");setFeitos(0);setRestam(null);
    let total=0;
    try{
      for(let i=0;i<200;i++){ // teto de segurança
        const r=await apiFetch("/admin/backfill-vencimento","POST",{});
        if(!r.success){ setErro(r.error||"Erro desconhecido"); break; }
        total+=r.atualizados||0; setFeitos(total); setRestam(r.restam);
        setMsg(`Processando... ${total} preenchidos, ~${r.restam} restantes`);
        if((r.lote||0)===0 || (r.restam||0)===0){ setMsg(`Concluído: ${total} pedido(s) com vencimento preenchido.`); break; }
        await new Promise(res=>setTimeout(res,600)); // respira entre lotes
      }
    }catch(e){setErro(e.message||"Falha na requisição");}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Preencher vencimento retroativo (pedidos com bordado)
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Grava a <code>data_vencimento</code> real nos pedidos com bordado já aprovados (a partir da data em que entraram em "Liberado para bordar" + prazo).
          Corrige o problema do prazo que "reiniciava" a cada edição. Roda em lotes — pode rodar quantas vezes quiser.
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button onClick={rodar} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,
          display:"inline-flex",alignItems:"center",gap:7
        }}>
          {rodando?"Rodando...":"Preencher vencimento agora"}
        </button>
        {msg&&<span style={{...F.body,fontSize:12,color:(restam===0?C.green:C.gray600),fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>
          {restam===0&&<Ic n="check" s={13} c={C.green}/>}{msg}
        </span>}
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
    </div>
  );
}

function BackfillVencimentoSemBordadoBtn(){
  const [rodando,setRodando]=useState(false);
  const [feitos,setFeitos]=useState(0);
  const [restam,setRestam]=useState(null);
  const [msg,setMsg]=useState("");
  const [erro,setErro]=useState("");
  const rodar=async()=>{
    if(!confirm("Preencher o vencimento retroativo dos pedidos SEM bordado (emissão + prazo)? Roda em lotes até terminar. É seguro e idempotente."))return;
    setRodando(true);setErro("");setMsg("");setFeitos(0);setRestam(null);
    let total=0;
    try{
      for(let i=0;i<200;i++){ // teto de segurança
        const r=await apiFetch("/backfill-vencimento-sembordado","POST",{});
        if(!r.success){ setErro(r.error||"Erro desconhecido"); break; }
        total+=r.gravados||0; setFeitos(total); setRestam(r.restam);
        setMsg(`Processando... ${total} preenchidos, ~${r.restam} restantes`);
        if((r.verificados||0)===0 || (r.restam||0)===0){ setMsg(`Concluído: ${total} pedido(s) com vencimento preenchido.`); break; }
        await new Promise(res=>setTimeout(res,600));
      }
    }catch(e){setErro(e.message||"Falha na requisição");}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Preencher vencimento retroativo (pedidos sem bordado)
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Grava a <code>data_vencimento</code> nos pedidos SEM bordado (emissão/closedate do Vendas + prazo sem bordado).
          Só grava onde o pedido realmente não tem bordado. Roda em lotes — pode rodar quantas vezes quiser.
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button onClick={rodar} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,
          display:"inline-flex",alignItems:"center",gap:7
        }}>
          {rodando?"Rodando...":"Preencher vencimento agora"}
        </button>
        {msg&&<span style={{...F.body,fontSize:12,color:(restam===0?C.green:C.gray600),fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>
          {restam===0&&<Ic n="check" s={13} c={C.green}/>}{msg}
        </span>}
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
    </div>
  );
}

// Finalização em LOTE: cola uma lista de pedidos (nº Linx e/ou ID de Vendas,
// misturados) e move todos direto pra Finalizados. Uso administrativo — ex.:
// quando a integração de nota fiscal está fora do ar.
function FinalizarLoteBtn({user}){
  const LISTA_PADRAO=`63211 63829 64276 63502 64955 65140 65145 65146 65147 60840143371 64634 60644335434 60653687203 62622463823 62622483715 62657646100 62639559063 62653113955 62706598823 62706348844 62706350404 62635590573 62704241574 62750599981 62653107325 62605147656 62852979618 62929861004 62448745334 62121906312 62853225244 62985424414 62639561321 63053428852 63083915822 63189253410 63189331474 63222135933 62660997815 62115474243 62939582901 62121717393 62441989214 62121803330 62622451462 63027787630 62622467642 62657817888 62416571541 62489870249 62628777617 62636891465 62706352429 62616665618 62706598224 63027887777 62639565752 62657756032 62742680158 62622462018 62487738184 61293019492 62853162416 62657883191 63027474818 62622485080 62121978225 62750575021 62704634691 62750571322 62950395244 63222403730 60694366779 62660994136 62750600564 64827`;
  const [txt,setTxt]=useState(LISTA_PADRAO);
  const [rodando,setRodando]=useState(false);
  const [res,setRes]=useState(null);
  const [erro,setErro]=useState("");
  const qtd=txt.split(/[\s,;]+/).map(s=>s.replace(/\D/g,"")).filter(Boolean).length;
  const rodar=async()=>{
    if(!qtd){setErro("Cole ao menos um número de pedido.");return;}
    if(!confirm(`Mover ${qtd} pedido(s) direto para Finalizados?\n\nIsso altera a etapa no HubSpot e registra uma nota de auditoria em cada um.`))return;
    setRodando(true);setErro("");setRes(null);
    try{
      const r=await apiFetch("/admin/finalizar-lote","POST",{
        ids:txt,executor:user?.nome||user?.email||"Admin SGP",
        motivo:"Finalização administrativa em lote (integração de NF indisponível)",
      });
      if(r&&r.success)setRes(r); else setErro((r&&r.error)||"Erro desconhecido");
    }catch(e){setErro(e.message);}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Finalizar pedidos em lote
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Cole os números (nº Linx e/ou ID do HubSpot, separados por espaço, vírgula ou linha) e mova todos direto para <strong>Finalizados</strong>.
          Pedidos já finalizados são ignorados.
        </div>
      </div>
      <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={4}
        placeholder="Ex.: 63211 63829 60840143371..."
        style={{width:"100%",boxSizing:"border-box",resize:"vertical",padding:"10px 12px",border:`1.5px solid ${C.gray200}`,borderRadius:8,...F.body,fontSize:12,outline:"none",fontFamily:"monospace"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button onClick={rodar} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body}}>
          {rodando?"Movendo...":`Finalizar ${qtd} pedido(s)`}
        </button>
        {res&&<span style={{...F.body,fontSize:12,color:C.green,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>
          <Ic n="check" s={13} c={C.green}/>
          {res.movidos} movido(s){res.jaFinalizados?` · ${res.jaFinalizados} já estavam finalizados`:""}{(res.naoEncontrados||[]).length?` · ${res.naoEncontrados.length} não encontrado(s)`:""}
        </span>}
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
      {res&&(res.naoEncontrados||[]).length>0&&<div style={{...F.body,fontSize:11,color:C.gray500,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 10px",wordBreak:"break-word"}}>
        <strong>Não encontrados:</strong> {res.naoEncontrados.join(", ")}
      </div>}
    </div>
  );
}

// Corrige itens de PERSONALIZAÇÃO (bordado/arte/silk/DTF) marcados como peça a
// bordar por engano — eles apareciam pra direcionar e como "pendente separação"
// na folha de impressão.
function CorrigirPersonalizacaoBtn({user}){
  const [pedido,setPedido]=useState("");
  const [rodando,setRodando]=useState(false);
  const [res,setRes]=useState(null);
  const [erro,setErro]=useState("");
  const rodar=async(todos)=>{
    const vid=pedido.replace(/\D/g,"");
    if(!todos&&!vid){setErro("Informe o ID do pedido de Vendas (ou use 'Varrer todos').");return;}
    if(!confirm(todos?"Varrer TODOS os pedidos e desmarcar linhas de personalização marcadas como bordado?":`Corrigir o pedido ${vid}?`))return;
    setRodando(true);setErro("");setRes(null);
    try{
      const r=await apiFetch("/admin/corrigir-personalizacao","POST",todos?{todos:true}:{vendasId:vid});
      if(r&&r.success)setRes(r); else setErro((r&&r.error)||"Erro desconhecido");
    }catch(e){setErro(e.message);}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Corrigir itens de personalização
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Desmarca como "bordado" as linhas de <strong>personalização</strong> (bordado, arte, silk, DTF) que foram marcadas por engano —
          elas apareciam para direcionar e como <em>pendente separação</em> na folha. Informe o ID de Vendas ou varra todos.
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <input value={pedido} onChange={e=>setPedido(e.target.value)} placeholder="ID do pedido (Vendas)"
          style={{padding:"9px 12px",border:`1.5px solid ${C.gray200}`,borderRadius:7,...F.body,fontSize:12,outline:"none",width:200}}/>
        <button onClick={()=>rodar(false)} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body}}>
          {rodando?"Corrigindo...":"Corrigir pedido"}
        </button>
        <button onClick={()=>rodar(true)} disabled={rodando} style={{
          background:C.white,color:C.gray700,border:`1.5px solid ${C.gray300}`,borderRadius:7,padding:"9px 14px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:12,...F.body}}>
          Varrer todos
        </button>
        {res&&<span style={{...F.body,fontSize:12,color:C.green,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>
          <Ic n="check" s={13} c={C.green}/> {res.corrigidos} item(ns) corrigido(s) de {res.verificados} verificado(s)
        </span>}
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
      {res&&(res.itens||[]).length>0&&<div style={{...F.body,fontSize:11,color:C.gray600,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 10px",maxHeight:120,overflowY:"auto"}}>
        {res.itens.map((it,i)=><div key={i}>• {it.sku} — {it.nome} (pedido {it.pedido})</div>)}
      </div>}
    </div>
  );
}

// Move pra Amostra Física as reprogramações que vieram de amostra FÍSICA
// reprovada mas ficaram na fila de Amostra Digital (regra antiga).
function MigrarReprogFisicaBtn(){
  const [rodando,setRodando]=useState(false);
  const [res,setRes]=useState(null);
  const [erro,setErro]=useState("");
  const rodar=async(preview)=>{
    if(!preview&&!confirm("Mover as reprogramações de amostra física que estão na fila de Amostra Digital para a fila de Amostra Física?"))return;
    setRodando(true);setErro("");setRes(null);
    try{
      const r=await apiFetch("/admin/migrar-reprog-fisica"+(preview?"?preview=1":""),"POST",{});
      if(r&&r.success)setRes(r); else setErro((r&&r.error)||"Erro desconhecido");
    }catch(e){setErro(e.message);}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Migrar reprogramações de amostra física
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Pedidos reprovados na <strong>amostra física</strong> voltavam para a fila de Amostra Digital (regra antiga).
          Esta ação move os que ainda estão lá para a nova aba de reprogramação da <strong>Amostra Física</strong>.
          Use "Simular" primeiro para ver quais serão afetados.
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button onClick={()=>rodar(true)} disabled={rodando} style={{
          background:C.white,color:C.gray700,border:`1.5px solid ${C.gray300}`,borderRadius:7,padding:"9px 14px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:12,...F.body}}>
          Simular
        </button>
        <button onClick={()=>rodar(false)} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body}}>
          {rodando?"Movendo...":"Migrar agora"}
        </button>
        {res&&<span style={{...F.body,fontSize:12,color:res.preview?C.gray600:C.green,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>
          {!res.preview&&<Ic n="check" s={13} c={C.green}/>}
          {res.preview?`${(res.pedidos||[]).length} pedido(s) seriam movidos (de ${res.verificados} na fila digital)`:`${res.movidos} pedido(s) movido(s)`}
        </span>}
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
      {res&&(res.pedidos||[]).length>0&&<div style={{...F.body,fontSize:11,color:C.gray600,background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 10px",maxHeight:140,overflowY:"auto"}}>
        {res.pedidos.map((p,i)=><div key={i}>• PED {p.linx||p.vendasId} — {p.motivo}</div>)}
      </div>}
    </div>
  );
}

// Monitor "Pedidos sem Pós-venda" — rede de segurança contra pedido que passa em
// branco. Esperto: ignora naturezas de faturamento/entrega futura (produção vai
// pra remessa). Só mostra vazamento real.
function MonitorSemPosvendaBtn(){
  const [rodando,setRodando]=useState(false);
  const [res,setRes]=useState(null);
  const [erro,setErro]=useState("");
  const [dias,setDias]=useState(30);
  const rodar=async()=>{
    setRodando(true);setErro("");setRes(null);
    try{
      const r=await apiFetch(`/admin/monitor-sem-posvenda?dias=${dias}`);
      if(r.success)setRes(r); else setErro(r.error||"Erro");
    }catch(e){setErro(e.message||"Falha na requisição");}
    finally{setRodando(false);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>
          Monitor — Pedidos que passaram em branco (sem pós-venda)
        </div>
        <div style={{...F.body,fontSize:12,color:C.gray500,lineHeight:1.45}}>
          Verifica os pedidos fechados que NÃO geraram pós-venda (não entraram no fluxo). Ignora as naturezas de faturamento/entrega futura (nessas a produção vai pra remessa) — mostra só o vazamento real, pra você mandar reprocessar.
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <label style={{...F.body,fontSize:12,color:C.gray600}}>Últimos
          <select value={dias} onChange={e=>setDias(Number(e.target.value))} style={{margin:"0 6px",border:`1px solid ${C.gray200}`,borderRadius:5,padding:"3px 6px",...F.body,fontSize:12}}>
            <option value={15}>15</option><option value={30}>30</option><option value={45}>45</option><option value={60}>60</option>
          </select> dias</label>
        <button onClick={rodar} disabled={rodando} style={{
          background:rodando?C.gray400:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 16px",
          cursor:rodando?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,display:"inline-flex",alignItems:"center",gap:7
        }}>{rodando?"Verificando...":"Verificar agora"}</button>
        {erro&&<span style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>Erro: {erro}</span>}
      </div>
      {res&&<div style={{marginTop:4}}>
        <div style={{...F.body,fontSize:12,color:res.total>0?C.red:C.green,fontWeight:700,marginBottom:res.total>0?8:0}}>
          {res.total>0
            ?<>⚠ {res.total} pedido(s) fechado(s) sem pós-venda (de {res.vendasAnalisadas} analisados).</>
            :<>✓ Nenhum pedido em branco nos últimos {res.dias} dias. Tudo entrou no fluxo.</>}
        </div>
        {res.total>0&&<div style={{overflowX:"auto",border:`1px solid ${C.gray200}`,borderRadius:8}}>
          <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",minWidth:520}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["Linx","ID Vendas","Fechado","Bordado","Natureza","Cliente"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",...F.body,fontSize:10,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{res.leaks.map(l=>(
              <tr key={l.id} style={{borderBottom:`1px solid ${C.gray100}`}}>
                <td style={{padding:"7px 10px",fontWeight:700,...F.body}}>{l.linx||"—"}</td>
                <td style={{padding:"7px 10px",...F.body,color:C.gray500,fontFamily:"monospace",fontSize:11}}>{l.id}</td>
                <td style={{padding:"7px 10px",...F.body,color:C.gray600}}>{l.closedate}</td>
                <td style={{padding:"7px 10px",...F.body}}>{l.comBordado?"sim":"não"}</td>
                <td style={{padding:"7px 10px",...F.body,color:C.gray600,fontSize:11}}>{l.natureza||"—"}</td>
                <td style={{padding:"7px 10px",...F.body,color:C.gray700}}>{l.razao}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>}
      </div>}
    </div>
  );
}

// ─── FILA GENÉRICA ────────────────────────────────────────────────────────────
function Fila({title,sub,etapa,orders,onOpen,actionLabel,actionColor=C.green,slaCfg,endpoint,finalizado,filtroBordador,setFiltroBordador,topoExtra,subTabsReprog,subTabExecutados,modoReprog,user}){
  const [busca,setBusca]=useState("");
  const [filtroSLA,setFiltroSLA]=useState("todos"); // todos | atrasados | risco | ok
  const [subTab,setSubTab]=useState("normal"); // normal | reprogramacao
  useRespPV(); // re-renderiza quando o mapa "responsável pós-venda" carregar
  // Override otimista do "colocado para bordar" (por vendasId) — atualiza o card
  // na hora, sem esperar o recarregamento do snapshot inteiro.
  const [colocadoOverride,setColocadoOverride]=useState({});
  const estaColocado=(o)=> colocadoOverride[o.vendasId]!==undefined ? colocadoOverride[o.vendasId] : (o.colocadoParaBordar===true);
  const toggleColocadoCard=async(o)=>{
    const novo=!estaColocado(o);
    setColocadoOverride(p=>({...p,[o.vendasId]:novo}));   // otimista, instantâneo
    try{ await apiFetch(`/colocar-para-bordar/${o.vendasId}`,"POST",{remover:!novo,ctx:{executor:user?.nome||user?.email||"Usuário SGP"}}); }
    catch(err){ setColocadoOverride(p=>({...p,[o.vendasId]:!novo})); alert("Erro: "+err.message); }
  };

  // Consome o snapshot único (1 chamada compartilhada com todas as outras telas).
  // Filtra apenas a etapa que essa tela é responsável. Não chama endpoint específico.
  const snap=useSnapshotAberto();
  const loading=snap.loading&&!snap.data;
  const loadError=snap.error;
  const carregar=snap.refresh;
  const hsData=useMemo(()=>{
    if(!snap.data)return null;
    const grupo=snap.data.porEtapa?.[etapa];
    if(!grupo)return [];
    return grupo.items.map(o=>normalizarCard(o,etapa));
  },[snap.data,etapa]);

  const source=hsData!==null?hsData:orders;
  // Um card pode ter várias etapas ativas (ex.: card em Programação + Separação).
  // Filtra por etapasAtivas — inclui o card se ele pertence a essa etapa.
  let mine=source.filter(o=>((o.etapasAtivas||[o.etapa]).includes(etapa))&&!o.concluido);

  // Filtro de busca (código do produto/SKU ou nome do cliente)
  const q=busca.trim().toLowerCase();
  if(q){
    mine=mine.filter(o=>
      (o.client||"").toLowerCase().includes(q) ||
      (o.id||"").toLowerCase().includes(q) ||
      String(o.pedidoLinx||"").toLowerCase().includes(q) ||
      String(o.vendasId||"").includes(q) ||
      (o.obsProdutos||"").toLowerCase().includes(q) ||
      (o.items||[]).some(it=>(it.sku||"").toLowerCase().includes(q)||(it.desc||"").toLowerCase().includes(q))
    );
  }

  // Filtro de SLA
  if(filtroSLA!=="todos"){
    mine=mine.filter(o=>{
      const st=getSLA(o,slaCfg).st;
      return filtroSLA==="atrasados"?st==="late":filtroSLA==="risco"?st==="risk":st==="ok";
    });
  }

  // Filtro por bordador externo (só usado na aba Externo). Usa o campo do card
  // (bordadoresExternos, vindo do snapshot) — o leve não carrega items. Mantém
  // fallback por items quando o card já foi enriquecido no modal.
  if(filtroBordador&&filtroBordador!=="todos"){
    mine=mine.filter(o=>
      (o.bordadoresExternos||[]).includes(filtroBordador) ||
      (o.items||[]).some(it=>(it.bordador||"")===filtroBordador)
    );
  }

  // Reprogramação aparece SÓ na fila onde o pedido está agora — e a etapa atual
  // já reflete a reprovação MAIS RECENTE (digital reprovada volta pra Amostra
  // Digital; física reprovada volta pra Amostra Física). Como o pedido ocupa uma
  // única etapa, ele nunca aparece em duas abas de reprogramação ao mesmo tempo,
  // mesmo tendo sido reprovado nas duas em ciclos diferentes.
  const ehReprogDaFila=(o)=>o.reprogramacao===true;
  // Telas separadas (Alteração de Amostra Digital/Física): a fila base esconde
  // as reprogramações e a tela de alteração mostra SÓ elas.
  if(modoReprog==="somente") mine=mine.filter(ehReprogDaFila);
  else if(modoReprog==="sem") mine=mine.filter(o=>!ehReprogDaFila(o));
  if(subTabsReprog){
    if(subTab==="reprogramacao") mine=mine.filter(ehReprogDaFila);
    else mine=mine.filter(o=>!ehReprogDaFila(o));
  }

  if(etapa==="Programação"){
    // Programação: ORDEM DE CHEGADA — o mais recente em cima (decisão do time).
    // "Chegada" = entrada na etapa (etapaAt); fallback pra emissão/entrada.
    const chegada=(o)=>o.etapaAt||o.entradaAt||o.dataFechamento||null;
    mine=[...mine].sort((a,b)=>{
      const ca=chegada(a),cb=chegada(b);
      if(!ca&&!cb)return 0;
      if(!ca)return 1;
      if(!cb)return -1;
      return new Date(cb)-new Date(ca);  // mais recente primeiro
    });
  } else {
    // Demais etapas: URGÊNCIA DE SLA — o mais "estourado" primeiro (casa com o
    // badge ATRASADO/EM RISCO/NO PRAZO e a barra Xh/Yh do card). htd = horas
    // úteis restantes até o prazo (negativo = já venceu; quanto menor, mais atrasado).
    mine=[...mine].sort((a,b)=>{
      const ha=getSLA(a,slaCfg,etapa).htd, hb=getSLA(b,slaCfg,etapa).htd;
      if(ha==null&&hb==null)return 0;
      if(ha==null)return 1;   // sem prazo definido vai pro fim
      if(hb==null)return -1;
      return ha-hb;           // menor htd (mais vencido) primeiro
    });
  }

  // Contadores para os chips de filtro. Usa o MESMO critério da lista (mine):
  // etapasAtivas, não a etapa principal. Assim o cabeçalho/contador bate com a
  // lista exibida e com a aba Minhas Demandas — um card ativo em "Em Separação"
  // mas com etapa principal em outra (ex.: Programação) conta aqui também.
  const all=source.filter(o=>((o.etapasAtivas||[o.etapa]).includes(etapa))&&!o.concluido)
    .filter(o=>modoReprog==="somente"?ehReprogDaFila(o):modoReprog==="sem"?!ehReprogDaFila(o):true);
  const nLate=all.filter(o=>getSLA(o,slaCfg,etapa).st==="late").length;
  const nRisk=all.filter(o=>getSLA(o,slaCfg,etapa).st==="risk").length;
  const nReprog=all.filter(ehReprogDaFila).length;
  const nNormal=all.filter(o=>!ehReprogDaFila(o)).length;

  const FilterChip=({id,label,count,color})=>(
    <button onClick={()=>setFiltroSLA(id)}
      style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:7,border:`1.5px solid ${filtroSLA===id?(color||C.red):C.gray200}`,background:filtroSLA===id?(color||C.red)+"0e":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:filtroSLA===id?700:500,color:filtroSLA===id?(color||C.red):C.gray600,whiteSpace:"nowrap"}}>
      {label}{count!==undefined&&<span style={{background:filtroSLA===id?(color||C.red):C.gray200,color:filtroSLA===id?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{count}</span>}
    </button>
  );

  return(
    <div style={{padding:24}}>
      <PageH title={title} sub={`${all.length} pedido${all.length!==1?"s":""} ${finalizado?"concluído"+(all.length!==1?"s":""):"nesta etapa"}${sub?" · "+sub:""}`} onRefresh={carregar} refreshing={loading}/>

      {topoExtra}

      {/* Sub-abas estilo Chrome: Demandas | Reprogramação (Amostras) | Executados (Programação) */}
      {(subTabsReprog||subTabExecutados) && <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:`1.5px solid ${C.gray200}`,alignItems:"flex-end"}}>
        <div onClick={()=>setSubTab("normal")}
          style={{
            padding:"10px 20px 11px",
            background: subTab==="normal" ? C.white : "transparent",
            border: subTab==="normal" ? `1.5px solid ${C.gray200}` : "1.5px solid transparent",
            borderBottom: subTab==="normal" ? `1.5px solid ${C.white}` : "none",
            borderRadius: "8px 8px 0 0",
            marginBottom: -1.5,
            cursor:"pointer",
            display:"inline-flex",alignItems:"center",gap:8,
            ...F.body,
            fontSize:13,
            fontWeight: subTab==="normal" ? 700 : 500,
            color: subTab==="normal" ? C.black : C.gray500,
            transition:"all 0.15s",
          }}>
          Demandas
          <span style={{background:subTab==="normal"?C.gray100:"transparent",color:C.gray600,padding:"1px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{nNormal}</span>
        </div>
        {subTabsReprog && <div onClick={()=>setSubTab("reprogramacao")}
          style={{
            padding:"10px 20px 11px",
            background: subTab==="reprogramacao" ? C.white : "transparent",
            border: subTab==="reprogramacao" ? `1.5px solid ${C.gray200}` : "1.5px solid transparent",
            borderBottom: subTab==="reprogramacao" ? `1.5px solid ${C.white}` : "none",
            borderRadius: "8px 8px 0 0",
            marginBottom: -1.5,
            cursor:"pointer",
            display:"inline-flex",alignItems:"center",gap:8,
            position:"relative",
            ...F.body,
            fontSize:13,
            fontWeight: subTab==="reprogramacao" ? 700 : 500,
            color: subTab==="reprogramacao" ? "#c2410c" : C.gray500,
            transition:"all 0.15s",
          }}>
          <span>↻</span> {etapa==="Amostra Física"?"Reprogramação Física":etapa==="Amostra Digital"?"Reprogramação Digital":"Reprogramação"}
          {nReprog>0 && <span style={{
            background:"#f97316",color:C.white,
            padding:"2px 8px",borderRadius:10,
            fontSize:11,fontWeight:800,
            minWidth:18,textAlign:"center",
            boxShadow:"0 0 0 2px "+C.white,
          }}>{nReprog}</span>}
        </div>}
        {subTabExecutados && <div onClick={()=>setSubTab("executados")}
          style={{padding:"10px 20px 11px",background:subTab==="executados"?C.white:"transparent",border:subTab==="executados"?`1.5px solid ${C.gray200}`:"1.5px solid transparent",borderBottom:subTab==="executados"?`1.5px solid ${C.white}`:"none",borderRadius:"8px 8px 0 0",marginBottom:-1.5,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,...F.body,fontSize:13,fontWeight:subTab==="executados"?700:500,color:subTab==="executados"?C.green:C.gray500,transition:"all 0.15s"}}>
          ✓ Executados
        </div>}
      </div>}

      {subTab==="executados" ? <ExecutadosLista user={user} onOpen={onOpen}/> : <>
      {/* Barra de busca + filtros */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,minWidth:220}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
            <Ic n="search" s={15} c={C.gray400}/>
          </div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido Linx, ID HubSpot ou SKU..."
            style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px 10px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        {!finalizado&&<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <FilterChip id="todos" label="Todos" count={all.length} color={C.gray600}/>
          <FilterChip id="atrasados" label="Atrasados" count={nLate} color={C.red}/>
          <FilterChip id="risco" label="Em risco" count={nRisk} color={C.amber}/>
          <FilterChip id="ok" label="No prazo" color={C.green}/>
        </div>}
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue,marginBottom:12}}>Carregando do HubSpot...</div>}
      {loadError&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:12}}>Erro: {loadError}</div>}

      {mine.length===0
        ?<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",padding:60,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          <Ic n="check" s={32} c={C.gray300} style={{display:"block",margin:"0 auto 10px"}}/>
          {q||filtroSLA!=="todos"?"Nenhum pedido encontrado com esses filtros.":"Nenhum pedido nesta etapa."}
        </div>
        :mine.map(o=>{
          const sla=getSLA(o,slaCfg,etapa);
          const ac=finalizado?C.green:(sla.st==="late"?C.red:sla.st==="risk"?C.amber:STAGE_COLOR[etapa]||C.gray300);
          const slaLabel=sla.st==="late"?"ATRASADO":sla.st==="risk"?"EM RISCO":"NO PRAZO";
          const slaColor=sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.green;
          // Contagens: snapshot leve não tem items detalhados. Usa qtdTotal
          // (total de peças) e totalItensSeparacao (nº de SKUs) do snapshot;
          // só cai pra o.items quando o modal já enriqueceu.
          const somaItems=o.items.reduce((s,i)=>s+(i.qty||0),0);
          const totalPecas=somaItems>0?somaItems:Number(o.qtdTotal||0);
          const totalSKUs=o.items.length>0?o.items.length:Number(o.totalItensSeparacao||0);
          return(
            <Card key={o.id} especial={temDataEspecial(o)} onClick={()=>onOpen({...o,_etapaOrigem:etapa})}
              style={{marginBottom:10,borderLeft:`4px solid ${ac}`,cursor:"pointer",transition:"box-shadow 0.15s,transform 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="";e.currentTarget.style.transform="";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
                    <span style={{...F.body,fontWeight:700,fontSize:14}}>{idPedido(o)}</span>
                    <TagCentroCusto cc={o.centroCusto} size="sm"/>
                    <TagTipo tipo={o.tipo} size="sm"/>
                    <BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>
                    {o.reprogramacao&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#f97316",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>↻ (ALTERAÇÃO)</span>}
                    {o.houveAlteracaoForm&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#b45309",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>⚠ ALTERAÇÃO DE FORMULÁRIO</span>}
                    {o.temBordado===false&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.gray600,color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>SEM BORDADO</span>}
                    {etapa==="Amostra Física"&&estaColocado(o)&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#7c3aed",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>🧵 NA MÁQUINA</span>}
                    {/* Badge de pagamento (Análise de Frete): liberado x pendente */}
                    {etapa==="Análise de Frete"&&(o.pagamentoLiberado
                      ?<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.green+"18",color:"#065f46",border:"1px solid #06534633",borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:800,letterSpacing:"0.04em"}}><Ic n="check" s={10} c="#065f46"/> PAGAMENTO LIBERADO</span>
                      :<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.red+"14",color:C.red,border:`1px solid ${C.red}44`,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:800,letterSpacing:"0.04em"}}><Ic n="warn" s={10} c={C.red}/> PAGAMENTO PENDENTE</span>)}
                    {/* Badge de status */}
                    {finalizado
                      ?(()=>{
                        // Tag baseada em status_faturamento: Pendente, Faturado ou Faturado Parcial
                        const st = (o.statusFaturamento||"").toLowerCase().trim();
                        let bg, cor, label;
                        if (st.includes("parcial")) {
                          bg = C.amber+"20"; cor = "#92400e"; label = "FATURADO PARCIAL";
                        } else if (st.includes("faturado")) {
                          bg = C.green+"18"; cor = "#065f46"; label = "FATURADO";
                        } else {
                          bg = C.gray100; cor = C.gray600; label = "PENDENTE FATURAMENTO";
                        }
                        return (
                          <span style={{display:"inline-flex",alignItems:"center",gap:5,background:bg,color:cor,border:`1px solid ${cor}33`,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:800,letterSpacing:"0.05em"}}>
                            {st.includes("faturado")&&!st.includes("parcial")&&<Ic n="check" s={10} c={cor}/>}
                            {st.includes("parcial")&&<Ic n="warn" s={10} c={cor}/>}
                            {!st.includes("faturado")&&<Ic n="clock" s={10} c={cor}/>}
                            {label}
                          </span>
                        );
                      })()
                      :<span style={{display:"inline-flex",alignItems:"center",gap:4,background:slaColor+"15",color:slaColor,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:slaColor,display:"inline-block"}}/>
                        {slaLabel}
                      </span>}
                  </div>
                  <div style={{...F.body,fontSize:13,color:C.black,fontWeight:600,marginBottom:3}}>{o.client||"—"}</div>
                  {(()=>{const rp=responsavelPosVendaDe(o.vendedor);return rp?<div style={{...F.body,fontSize:11,color:"#7c3aed",fontWeight:600,marginBottom:4,display:"flex",alignItems:"center",gap:4}}><Ic n="phone" s={11} c="#7c3aed"/> Pós-venda: {rp}</div>:null;})()}
                  {(o.aguardadoPor||[]).length>0&&<div style={{...F.body,fontSize:11,color:"#1d4ed8",fontWeight:600,marginBottom:4,display:"flex",alignItems:"center",gap:4,background:"#1d4ed812",border:"1px solid #1d4ed833",borderRadius:6,padding:"3px 8px"}}>🔗 {o.aguardadoPor.length===1?`PED-${o.aguardadoPor[0].pedido} aguarda faturar junto`:`${o.aguardadoPor.length} pedidos aguardam faturar junto`}</div>}
                  <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:6}}>{etapa==="Programação"
                    ? (()=>{const n=(o.bordadosJson||[]).filter(b=>/~prog/i.test(b.fileName||"")).length||(o.bordadosJson||[]).length; return `${n} programaç${n===1?"ão":"ões"}`;})()
                    : `${fmtR(o.valor)} · ${totalSKUs} SKU${totalSKUs!==1?"s":""} · ${totalPecas} peça${totalPecas!==1?"s":""}`}</div>
                  {etapa==="Análise de Frete"&&<div style={{display:"flex",flexWrap:"wrap",gap:8,margin:"2px 0 8px"}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#0891b214",color:"#0e7490",border:"1px solid #0891b233",borderRadius:7,padding:"5px 11px",...F.body,fontSize:12.5,fontWeight:800}}>🚚 {o.transportadora||"Transportadora não informada"}</span>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#0891b214",color:"#0e7490",border:"1px solid #0891b233",borderRadius:7,padding:"5px 11px",...F.body,fontSize:12.5,fontWeight:800}}>Frete: {fmtR(o.valorFrete||0)}{o.pagadorFrete?` · ${o.pagadorFrete}`:""}</span>
                  </div>}
                  {etapa==="Programação"&&<div style={{...F.body,fontSize:11,color:C.gray600,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                    <Ic n="check" s={11} c={C.gray400}/>
                    {o.dataFechamento?<>Emissão: <strong style={{color:C.gray700}}>{fmtDS(o.dataFechamento)}</strong></>:"Emissão não informada"}
                  </div>}
                  {etapa==="Programação"&&o.etapaAt&&<div style={{...F.body,fontSize:11,color:C.gray600,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                    <Ic n="arrow" s={11} c={C.gray400}/>
                    Entrou na Programação: <strong style={{color:C.gray700}}>{fmtDS(o.etapaAt)}</strong>
                  </div>}
                  {!finalizado&&o.dataVencimento&&<div style={{...F.body,fontSize:11,color:new Date(o.dataVencimento)<new Date()?C.red:C.gray600,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                    <Ic n="clock" s={11} c={new Date(o.dataVencimento)<new Date()?C.red:C.gray500}/>
                    Vence em {fmtVenc(dataVencimento(o),true)}
                  </div>}
                  {!finalizado&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,maxWidth:340}}>
                    <SLABar pct={sla.pct} st={sla.st}/>
                    <span style={{...F.body,fontSize:10,color:slaColor,fontWeight:700,flexShrink:0}}>{sla.hrs.toFixed(0)}h/{sla.sla}h</span>
                  </div>}
                  {o.alertas.length>0&&<div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>{o.alertas.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,...F.body,fontSize:11,color:"#92400e",fontWeight:600}}><Ic n="warn" s={11} c={C.amber}/>{a}</div>)}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
                  {etapa==="Amostra Física"&&(()=>{const col=estaColocado(o);return <button
                    onClick={(e)=>{e.stopPropagation();toggleColocadoCard(o);}}
                    title={col?"Clique para desmarcar":"Marcar que já foi colocado na máquina"}
                    style={{display:"inline-flex",alignItems:"center",gap:6,border:col?`1.5px solid ${C.green}`:`1.5px solid #7c3aed`,background:col?C.green+"12":"#7c3aed",color:col?"#065f46":C.white,borderRadius:7,padding:"7px 12px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                    {col?<><Ic n="check" s={13} c="#065f46"/> Na máquina</>:<>🧵 Colocar para Bordar</>}
                  </button>;})()}
                  <div style={{display:"flex",alignItems:"center",gap:6,color:C.gray400}}>
                    <span style={{...F.body,fontSize:12,color:C.gray400}}>Abrir</span>
                    <Ic n="chevR" s={16} c={C.gray400}/>
                  </div>
                </div>
              </div>
            </Card>
          );
        })
      }
      </>}
    </div>
  );
}

// ─── USUÁRIOS (gestão dinâmica por módulo, via Worker + KV) ───────────────────
// ─── MÓDULO: REGISTROS DE ALTERAÇÃO DE FORMULÁRIO ────────────────────────────
function AlteracoesFormList(){
  const[regs,setRegs]=useState([]);
  const[loading,setLoading]=useState(true);
  const[erro,setErro]=useState("");
  const[busca,setBusca]=useState("");

  const carregar=async()=>{
    setLoading(true);setErro("");
    try{
      const r=await apiFetch("/alteracoes-formulario");
      setRegs(r.data||[]);
    }catch(e){setErro(e.message);}
    finally{setLoading(false);}
  };
  useEffect(()=>{carregar();},[]);

  const q=busca.trim().toLowerCase();
  const filtrados=q
    ?regs.filter(r=>(r.cliente||"").toLowerCase().includes(q)||String(r.pedido_id||"").includes(q)||(r.executor||"").toLowerCase().includes(q))
    :regs;

  return(
    <div style={{padding:24}}>
      <PageH title="Alterações de Formulário" sub={`${regs.length} registro${regs.length!==1?"s":""} de alteração`} onRefresh={carregar} refreshing={loading}/>

      <div style={{position:"relative",marginBottom:16,maxWidth:420}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={15} c={C.gray400}/></div>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido ou executor..."
          style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px 10px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue,marginBottom:12}}>Carregando registros...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:12}}>Erro: {erro}</div>}

      {!loading&&filtrados.length===0
        ?<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",padding:60,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          {q?"Nenhum registro encontrado.":"Nenhuma alteração de formulário registrada ainda."}
        </div>
        :filtrados.map((r,i)=>{
          const det=r.detalhes||{};
          return(
            <Card key={r.id||i} style={{marginBottom:10,borderLeft:`4px solid #b45309`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#b45309",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>⚠ ALTERAÇÃO DE FORMULÁRIO</span>
                    {r.pedido_id&&<span style={{...F.body,fontWeight:700,fontSize:14}}>PED-{r.pedido_id}</span>}
                  </div>
                  <div style={{...F.body,fontSize:13,color:C.black,fontWeight:600,marginBottom:3}}>{r.cliente||"—"}</div>
                  {(det.etapaOrigem||det.voltouPara)&&<div style={{...F.body,fontSize:12,color:C.gray600,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                    <span>{det.etapaOrigem||"—"}</span><Ic n="arrow" s={12} c={C.gray400}/><strong style={{color:"#b45309"}}>{det.voltouPara||"—"}</strong>
                  </div>}
                  <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",marginTop:4}}>
                    <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo</div>
                    <div style={{...F.body,fontSize:13,color:C.gray700}}>{det.motivo||"—"}</div>
                  </div>
                </div>
                <div style={{textAlign:"right",...F.body,fontSize:11,color:C.gray500,flexShrink:0}}>
                  <div style={{fontWeight:600,color:C.gray700}}>{r.executor||"Sistema"}</div>
                  <div>{r.criado_em?fmtD(r.criado_em):""}</div>
                </div>
              </div>
            </Card>
          );
        })
      }
    </div>
  );
}

// ─── ACESSO EM LOTE POR MÓDULO ────────────────────────────────────────────────
// Escolha um módulo e marque/desmarque várias pessoas de uma vez, sem precisar
// abrir usuário por usuário. Aplica só a diferença (concede aos novos, remove
// dos que foram desmarcados).
function AcessoEmLote({users,onSalvo}){
  const[modulo,setModulo]=useState("");
  const[sel,setSel]=useState([]);
  const[busca,setBusca]=useState("");
  const[salvando,setSalvando]=useState(false);
  const[msg,setMsg]=useState(null);

  const comuns=useMemo(()=>(users||[]).filter(u=>!u.admin),[users]);
  const originais=useMemo(()=>
    comuns.filter(u=>(u.modulos||[]).includes(modulo)).map(u=>u.email),
  [comuns,modulo]);

  // Ao trocar de módulo, a seleção reflete quem já tem o acesso hoje.
  useEffect(()=>{setSel(originais);setMsg(null);},[modulo]); // eslint-disable-line

  const visiveis=useMemo(()=>{
    const q=busca.trim().toLowerCase();
    if(!q)return comuns;
    return comuns.filter(u=>(u.nome||"").toLowerCase().includes(q)||(u.email||"").toLowerCase().includes(q));
  },[comuns,busca]);

  const toggle=(email)=>setSel(s=>s.includes(email)?s.filter(e=>e!==email):[...s,email]);
  const marcarTodos=()=>{
    const ids=visiveis.map(u=>u.email);
    const allOn=ids.length>0&&ids.every(e=>sel.includes(e));
    setSel(s=>allOn?s.filter(e=>!ids.includes(e)):[...new Set([...s,...ids])]);
  };

  const conceder=sel.filter(e=>!originais.includes(e));
  const remover=originais.filter(e=>!sel.includes(e));
  const temMudanca=conceder.length>0||remover.length>0;

  const salvar=async()=>{
    if(!modulo){alert("Escolha um módulo primeiro.");return;}
    if(!temMudanca){alert("Nada mudou.");return;}
    if(remover.length&&!confirm(`Você vai REMOVER o acesso de ${remover.length} pessoa(s) e conceder a ${conceder.length}. Confirma?`))return;
    setSalvando(true);setMsg(null);
    try{
      let concedidos=0,removidos=0;
      if(conceder.length){
        const r=await apiFetch("/usuarios/modulo-lote","POST",{modulo,acao:"conceder",emails:conceder});
        concedidos=r.alterados||0;
      }
      if(remover.length){
        const r=await apiFetch("/usuarios/modulo-lote","POST",{modulo,acao:"remover",emails:remover});
        removidos=r.alterados||0;
      }
      setMsg({ok:true,txt:`Pronto: ${concedidos} acesso(s) concedido(s) e ${removidos} removido(s).`});
      onSalvo&&onSalvo();
    }catch(e){setMsg({ok:false,txt:e.message});}
    finally{setSalvando(false);}
  };

  const GRUPOS_LOTE=GRUPOS_MENU;
  const inputSt={width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:C.white};

  return(
    <Card style={{marginBottom:16}}>
      <SecH>Acesso em lote por módulo</SecH>
      <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>
        Criou um módulo novo? Escolha ele aqui e marque todo mundo que deve enxergar, de uma vez só. Quem já tem o acesso vem marcado — desmarcar remove.
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end",marginBottom:14}}>
        <div style={{flex:"1 1 260px"}}>
          <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>Módulo</label>
          <select value={modulo} onChange={e=>setModulo(e.target.value)} style={inputSt}>
            <option value="">— escolha um módulo —</option>
            {GRUPOS_LOTE.map(g=>{
              const itens=NAV_ITEMS.filter(n=>n.grupo===g);
              if(!itens.length)return null;
              return<optgroup key={g} label={g}>
                {itens.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}
              </optgroup>;
            })}
            {PERMISSOES_ESPECIAIS.length>0&&<optgroup label="Permissões especiais">
              {PERMISSOES_ESPECIAIS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
            </optgroup>}
          </select>
        </div>
        <div style={{flex:"1 1 200px"}}>
          <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>Buscar pessoa</label>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="nome ou e-mail" style={inputSt}/>
        </div>
      </div>

      {!modulo
        ?<div style={{padding:"18px 0",...F.body,fontSize:13,color:C.gray400}}>Escolha um módulo acima para liberar a lista de pessoas.</div>
        :<>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
            <button onClick={marcarTodos} style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:4,padding:"3px 10px",...F.body,fontSize:11,color:C.gray600,cursor:"pointer"}}>
              {visiveis.length>0&&visiveis.every(u=>sel.includes(u.email))?"Desmarcar todos":"Marcar todos"}
            </button>
            <span style={{...F.body,fontSize:11.5,color:C.gray500}}>
              {sel.length} de {comuns.length} selecionado(s)
              {temMudanca&&<span style={{color:C.amber,fontWeight:600}}>{" · "}{conceder.length} a conceder, {remover.length} a remover</span>}
            </span>
          </div>

          <div className="sgp-scroll" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:6,maxHeight:320,overflowY:"auto",marginBottom:14,paddingRight:2}}>
            {visiveis.map(u=>{
              const on=sel.includes(u.email);
              const tinha=originais.includes(u.email);
              const novo=on&&!tinha, saindo=!on&&tinha;
              const borda=novo?C.green:saindo?C.amber:on?C.red:C.gray200;
              return(
                <div key={u.email} onClick={()=>toggle(u.email)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:6,border:`1.5px solid ${borda}`,background:on?borda+"0c":C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${on?borda:C.gray300}`,background:on?borda:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {on&&<Ic n="check" s={11} c={C.white}/>}
                  </div>
                  <div style={{minWidth:0,flex:1}}>
                    <div style={{...F.body,fontSize:12,color:on?C.black:C.gray600,fontWeight:on?600:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.nome}</div>
                    <div style={{...F.body,fontSize:10,color:C.gray400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.email}</div>
                  </div>
                  {novo&&<span style={{...F.title,fontSize:8.5,fontWeight:800,letterSpacing:"0.06em",padding:"2px 6px",borderRadius:4,background:C.green+"18",color:C.green}}>NOVO</span>}
                  {saindo&&<span style={{...F.title,fontSize:8.5,fontWeight:800,letterSpacing:"0.06em",padding:"2px 6px",borderRadius:4,background:C.amber+"20",color:C.amber}}>SAI</span>}
                </div>
              );
            })}
            {visiveis.length===0&&<div style={{...F.body,fontSize:12,color:C.gray400,padding:"12px 0"}}>Nenhuma pessoa encontrada.</div>}
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <Btn label={salvando?"Aplicando...":"Aplicar acessos"} icon="check" variant="success" onClick={salvar} disabled={salvando||!temMudanca}/>
            {temMudanca&&<Btn label="Descartar mudanças" variant="secondary" onClick={()=>setSel(originais)}/>}
            <span style={{...F.body,fontSize:11,color:C.gray400}}>Administradores não aparecem — já têm acesso a tudo.</span>
          </div>
        </>}

      {msg&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:(msg.ok?C.green:C.red)+"12",border:`1px solid ${(msg.ok?C.green:C.red)}33`,...F.body,fontSize:13,color:msg.ok?C.green:C.red}}>{msg.txt}</div>}
    </Card>
  );
}

function Usuarios(){
  const[users,setUsers]=useState([]);
  const[loading,setLoading]=useState(true);
  const[err,setErr]=useState(null);
  const[show,setShow]=useState(false);
  const[editId,setEditId]=useState(null);
  const[form,setForm]=useState({nome:"",email:"",senha:"",modulos:[]});
  // Diagnóstico de login
  const[diag,setDiag]=useState({email:"",senha:"",ver:false,resultado:null,carregando:false});
  const testarLogin=()=>{
    if(!diag.email||!diag.senha){alert("Preencha e-mail e senha para testar.");return;}
    setDiag(d=>({...d,carregando:true,resultado:null}));
    apiFetch("/diagnostico-login","POST",{email:diag.email,senha:diag.senha})
      .then(r=>setDiag(d=>({...d,resultado:r})))
      .catch(e=>setDiag(d=>({...d,resultado:{erro:e.message}})))
      .finally(()=>setDiag(d=>({...d,carregando:false})));
  };

  const carregar=()=>{
    setLoading(true);setErr(null);
    apiFetch("/usuarios")
      .then(r=>{if(r.success)setUsers(r.users);})
      .catch(e=>setErr(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[]);

  const GRUPOS=GRUPOS_MENU;

  const toggleMod=(m)=>setForm(f=>({...f,modulos:f.modulos.includes(m)?f.modulos.filter(x=>x!==m):[...f.modulos,m]}));
  const toggleGrupo=(grupo)=>{
    const ids=NAV_ITEMS.filter(n=>n.grupo===grupo).map(n=>n.id);
    const allOn=ids.every(id=>form.modulos.includes(id));
    setForm(f=>({...f,modulos:allOn?f.modulos.filter(m=>!ids.includes(m)):[...new Set([...f.modulos,...ids])]}));
  };

  const abrirNovo=()=>{setEditId(null);setForm({nome:"",email:"",senha:"",modulos:[],bordadorExterno:""});setShow(true);};
  const abrirEdit=(u)=>{setEditId(u.id);setForm({nome:u.nome,email:u.email,senha:"",modulos:u.modulos||[],bordadorExterno:u.bordadorExterno||""});setShow(true);};

  const salvar=()=>{
    if(!form.nome||!form.email||(!editId&&!form.senha)){alert("Preencha nome, e-mail e senha.");return;}
    // Acesso EXTERNO: quem tem bordador vinculado enxerga só a tela dele.
    // Zeramos os módulos pra não sobrar permissão interna por engano.
    const ext=String(form.bordadorExterno||"").trim();
    const mods=ext?[]:form.modulos;
    const req = editId
      ? apiFetch(`/usuarios/${encodeURIComponent(editId)}`,"PATCH",{nome:form.nome,modulos:mods,bordadorExterno:ext,...(form.senha?{senha:form.senha}:{})})
      : apiFetch("/usuarios","POST",{nome:form.nome,email:form.email,senha:form.senha,modulos:mods,bordadorExterno:ext});
    req.then(r=>{if(r.success){setShow(false);carregar();}else alert(r.error||"Erro");})
       .catch(e=>alert(e.message));
  };

  const excluir=(u)=>{
    if(!confirm(`Excluir o acesso de ${u.nome}?`))return;
    apiFetch(`/usuarios/${encodeURIComponent(u.id)}`,"DELETE")
      .then(()=>carregar()).catch(e=>alert(e.message));
  };

  const ini=(nome)=>(nome||"").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  return(
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <PageH title="Usuários" sub="Crie acessos e defina quais módulos cada pessoa enxerga" onRefresh={carregar} refreshing={loading}/>
        <Btn label="Novo acesso" icon="users" onClick={abrirNovo}/>
      </div>

      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:20}}>Carregando usuários...</div>}
      {err&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:16}}>Erro: {err}</div>}

      {show&&<Card style={{marginBottom:16}}>
        <SecH>{editId?"Editar acesso":"Novo acesso"}</SecH>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,marginBottom:16}}>
          <div>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>Nome do acesso</label>
            <input placeholder="Ex: Analista de Bordado" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>E-mail</label>
            <input placeholder="email@citerol.com.br" value={form.email} disabled={!!editId} onChange={e=>setForm({...form,email:e.target.value})}
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:editId?C.gray100:C.white}}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>{editId?"Nova senha (deixe vazio p/ manter)":"Senha"}</label>
            <input type="password" placeholder="••••••" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})}
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>

        {/* ACESSO EXTERNO — bordador terceirizado.
            Fica no topo porque muda tudo o que vem depois: escolhido um
            bordador, a pessoa passa a ver SÓ as peças dela e nada mais do SGP.
            Por isso as permissões internas somem da tela. */}
        <div style={{border:`1.5px solid ${form.bordadorExterno?C.purple:C.gray200}`,background:form.bordadorExterno?C.purple+"0a":C.gray50,borderRadius:8,padding:"12px 14px",marginBottom:16}}>
          <label style={{...F.body,fontSize:10,fontWeight:700,color:form.bordadorExterno?C.purple:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Acesso externo — bordador terceirizado</label>
          <select value={form.bordadorExterno||""} onChange={e=>setForm({...form,bordadorExterno:e.target.value})}
            style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:C.white}}>
            <option value="">Não — usuário interno da Citerol</option>
            <option value="bordadel">Bordadel</option>
            <option value="mg_bordados">MG Bordados</option>
          </select>
          {form.bordadorExterno
            ? <div style={{...F.body,fontSize:11.5,color:C.purple,marginTop:7,lineHeight:1.5,fontWeight:600}}>
                Este acesso verá <strong>apenas as peças direcionadas a {form.bordadorExterno==="bordadel"?"Bordadel":"MG Bordados"}</strong> — sem cliente, valor ou CNPJ. As permissões internas abaixo não se aplicam e serão limpas ao salvar.
              </div>
            : <div style={{...F.body,fontSize:11.5,color:C.gray500,marginTop:7,lineHeight:1.5}}>
                Deixe assim para usuários da Citerol. Só marque quando for uma empresa de fora.
              </div>}
        </div>

        {/* Administrador — acesso total + ações restritas */}
        {!form.bordadorExterno&&(()=>{const on=form.modulos.includes("admin");return(
          <div onClick={()=>toggleMod("admin")} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:8,border:`1.5px solid ${on?C.red:C.gray200}`,background:on?C.red+"0a":C.gray50,cursor:"pointer",marginBottom:16}}>
            <div style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${on?C.red:C.gray300}`,background:on?C.red:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{on&&<Ic n="check" s={12} c={C.white}/>}</div>
            <div>
              <div style={{...F.body,fontSize:13,fontWeight:700,color:on?C.red:C.gray700}}>Administrador</div>
              <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:1}}>Acesso total a todos os módulos e às ações restritas (Alterar Etapa, Gerar Bordado).</div>
            </div>
          </div>);})()}

        {/* Seleção de módulos por grupo — não se aplica a acesso externo */}
        {!form.bordadorExterno&&<div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Módulos com acesso <span style={{fontWeight:400,textTransform:"none",color:C.gray400}}>(ignorado se for Administrador)</span></div>}
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
          {!form.bordadorExterno&&GRUPOS.map(grupo=>{
            const itensGrupo=NAV_ITEMS.filter(n=>n.grupo===grupo);
            const allOn=itensGrupo.every(n=>form.modulos.includes(n.id));
            return(
              <div key={grupo}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{...F.title,fontSize:11,fontWeight:700,color:C.black,letterSpacing:"0.08em"}}>{grupo.toUpperCase()}</span>
                  <button onClick={()=>toggleGrupo(grupo)} style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:4,padding:"2px 8px",...F.body,fontSize:10,color:C.gray500,cursor:"pointer"}}>
                    {allOn?"Desmarcar todos":"Marcar todos"}
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>
                  {itensGrupo.map(n=>{
                    const on=form.modulos.includes(n.id);
                    return(
                      <div key={n.id} onClick={()=>toggleMod(n.id)}
                        style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:6,border:`1.5px solid ${on?C.red:C.gray200}`,background:on?C.red+"08":C.white,cursor:"pointer"}}>
                        <div style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${on?C.red:C.gray300}`,background:on?C.red:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {on&&<Ic n="check" s={11} c={C.white}/>}
                        </div>
                        <Ic n={n.icon} s={14} c={on?C.red:C.gray400}/>
                        <span style={{...F.body,fontSize:12,color:on?C.black:C.gray600,fontWeight:on?600:400}}>{n.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Permissões especiais (ações, não menus) */}
        {PERMISSOES_ESPECIAIS.length>0&&<>
        <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Permissões especiais</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:6,marginBottom:16}}>
          {PERMISSOES_ESPECIAIS.map(p=>{
            const on=form.modulos.includes(p.id);
            return(
              <div key={p.id} onClick={()=>toggleMod(p.id)} title={p.desc}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:6,border:`1.5px solid ${on?C.red:C.gray200}`,background:on?C.red+"08":C.white,cursor:"pointer"}}>
                <div style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${on?C.red:C.gray300}`,background:on?C.red:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {on&&<Ic n="check" s={11} c={C.white}/>}
                </div>
                <Ic n={p.icon} s={14} c={on?C.red:C.gray400}/>
                <div style={{minWidth:0}}>
                  <div style={{...F.body,fontSize:12,color:on?C.black:C.gray600,fontWeight:on?600:400}}>{p.label}</div>
                  <div style={{...F.body,fontSize:10.5,color:C.gray400,marginTop:1}}>{p.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        </>}

        <div style={{display:"flex",gap:8}}>
          <Btn label={editId?"Salvar alterações":"Criar acesso"} icon="check" variant="success" onClick={salvar}/>
          <Btn label="Cancelar" variant="secondary" onClick={()=>setShow(false)}/>
        </div>
      </Card>}

      <AcessoEmLote users={users} onSalvo={carregar}/>

      <Card style={{marginBottom:16,background:C.gray50}}>
        <SecH>Diagnóstico de login</SecH>
        <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:12}}>Teste um e-mail e senha para ver exatamente o que acontece (sem precisar sair da sua conta).</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:"1 1 200px"}}>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>E-mail</label>
            <input value={diag.email} onChange={e=>setDiag(d=>({...d,email:e.target.value}))} placeholder="email@citerol.com.br"
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{flex:"1 1 200px"}}>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>Senha</label>
            <div style={{position:"relative"}}>
              <input type={diag.ver?"text":"password"} value={diag.senha} onChange={e=>setDiag(d=>({...d,senha:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&testarLogin()} placeholder="senha"
                style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 38px 9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              <button type="button" onClick={()=>setDiag(d=>({...d,ver:!d.ver}))} style={{position:"absolute",right:6,top:0,bottom:0,background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center"}}>
                <Ic n={diag.ver?"eyeOff":"eye"} s={17} c={C.gray400}/>
              </button>
            </div>
          </div>
          <Btn label={diag.carregando?"Testando...":"Testar login"} icon="check" onClick={testarLogin}/>
        </div>
        {diag.resultado&&(()=>{
          const r=diag.resultado;
          if(r.erro)return<div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:C.red+"0e",border:`1px solid ${C.red}28`,...F.body,fontSize:13,color:C.red}}>Erro ao testar: {r.erro}</div>;
          const mapa={
            ok:{cor:C.green,txt:"Tudo certo! Esse e-mail e senha entram normalmente. Se ainda der erro na tela de login, é cache — atualize a página (Ctrl+Shift+R)."},
            usuario_nao_encontrado:{cor:C.red,txt:`Usuário NÃO encontrado no banco (procurei por "${r.chaveProcurada}"). Confira se o e-mail está exatamente igual ao do cadastro, ou aguarde ~1 min (propagação do KV) e teste de novo.`},
            usuario_inativo:{cor:C.amber,txt:"O usuário existe, mas está INATIVO. Reative no cadastro."},
            senha_incorreta:{cor:C.red,txt:`O usuário existe e está ativo, mas a SENHA não confere. E-mail armazenado: "${r.emailArmazenado}". Edite o usuário e defina a senha de novo (ou recrie).`},
          };
          const m=mapa[r.etapa]||{cor:C.gray600,txt:JSON.stringify(r)};
          return<div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:m.cor+"12",border:`1px solid ${m.cor}33`,...F.body,fontSize:13,color:m.cor,lineHeight:1.5}}>{m.txt}</div>;
        })()}
      </Card>

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:520}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["Acesso","E-mail","Módulos","Ações"].map(hd=><th key={hd} style={{padding:"11px 16px",textAlign:"left",...F.body,fontSize:11,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{hd}</th>)}
            </tr></thead>
            <tbody>{users.map(u=>(
              <tr key={u.id} style={{borderBottom:`1px solid ${C.gray100}`}}>
                <td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av ini={ini(u.nome)} size={28}/><span style={{...F.body,fontWeight:600,color:C.black}}>{u.nome}</span>{u.admin&&<span style={{...F.title,fontSize:9,fontWeight:800,letterSpacing:"0.06em",padding:"2px 7px",borderRadius:5,background:C.red+"14",color:C.red,border:`1px solid ${C.red}44`}}>ADMIN</span>}</div></td>
                <td style={{padding:"11px 16px",...F.body,color:C.gray500,fontSize:12}}>{u.email}</td>
                <td style={{padding:"11px 16px"}}>{u.admin?<Tag label="Acesso total" color={C.red}/>:<Tag label={`${(u.modulos||[]).length} módulo${(u.modulos||[]).length!==1?"s":""}`} color={C.gray600}/>}</td>
                <td style={{padding:"11px 16px"}}><div style={{display:"flex",gap:6}}>
                  <Btn label="Editar" variant="secondary" size="sm" onClick={()=>abrirEdit(u)}/>
                  <Btn label="Remover" variant="danger" size="sm" onClick={()=>excluir(u)}/>
                </div></td>
              </tr>
            ))}
            {!loading&&users.length===0&&<tr><td colSpan={4} style={{padding:30,textAlign:"center",...F.body,color:C.gray400,fontSize:13}}>Nenhum acesso criado ainda.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── NOTIFICAÇÕES ─────────────────────────────────────────────────────────────
function NotifPanel({notifs,onClose,onAbrir}){
  const fmt=(iso)=>{if(!iso)return"";const d=new Date(iso);return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;};
  return(
    <div style={{position:"fixed",top:56,right:0,width:340,maxWidth:"92vw",background:C.white,borderLeft:`1px solid ${C.gray200}`,boxShadow:"-4px 8px 24px rgba(0,0,0,0.08)",zIndex:200,maxHeight:"75vh",overflow:"auto"}} className="sgp-scroll">
      <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.white}}>
        <span style={{...F.title,fontWeight:700,fontSize:12,letterSpacing:"0.1em"}}>NOTIFICAÇÕES</span>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Ic n="close" s={16} c={C.gray400}/></button>
      </div>
      {(!notifs||notifs.length===0)?<div style={{padding:28,...F.body,color:C.gray400,fontSize:13,textAlign:"center"}}>Nenhuma notificação.</div>
        :notifs.map((n)=>(
          <div key={n.id} onClick={()=>onAbrir(n)} style={{padding:"12px 18px",borderBottom:`1px solid ${C.gray100}`,background:n.lida?C.white:C.red+"08",cursor:"pointer",display:"flex",gap:10}}
            onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
            onMouseLeave={e=>e.currentTarget.style.background=n.lida?C.white:C.red+"08"}>
            {!n.lida&&<div style={{width:7,height:7,borderRadius:"50%",background:C.red,marginTop:6,flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{...F.body,fontSize:13,color:C.black,lineHeight:1.45}}>
                <b>{n.autor||"Alguém"}</b> mencionou você: <span style={{color:C.gray600}}>"{n.trecho}"</span>
              </div>
              <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>
                Pedido {n.pedido_id}{n.cliente?` · ${n.cliente}`:""} · {fmt(n.criado_em)}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const[email,setE]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[loading,setLoading]=useState(false);const[verPw,setVerPw]=useState(false);
  const go=()=>{
    const em=email.trim().toLowerCase();const pwd=pw.trim();
    if(!em||!pwd){setErr("Preencha e-mail e senha.");return;}
    setLoading(true);setErr("");
    apiFetch("/login","POST",{email:em,senha:pwd})
      .then(r=>{
        if(r.success&&r.user){
          // adiciona ini e admin para o portal
          const nome=r.user.nome||r.user.name||r.user.email||"Usuário";
          const u={...r.user,nome,name:nome,ini:nome.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()};
          onLogin(u,r.sessao);   // guarda o token de sessão junto
        }else setErr(r.error||"E-mail ou senha incorretos.");
      })
      .catch(()=>setErr("E-mail ou senha incorretos."))
      .finally(()=>setLoading(false));
  };
  return(
    <div style={{minHeight:"100vh",background:C.gray100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{background:C.white,borderRadius:10,padding:"40px 36px",border:`1px solid ${C.gray200}`}}>
          <div style={{marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <img src={BRASAO_SGP} alt="SGP" style={{height:38,width:"auto",display:"block"}}/>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <div style={{...F.title,fontSize:19,fontWeight:700,color:C.black,letterSpacing:"0.05em",lineHeight:1}}>SGP</div>
                <div style={{...F.body,fontSize:10.5,color:C.gray500,letterSpacing:"0.01em",lineHeight:1.2,marginTop:3}}>Sistema de Gestão de Personalizados</div>
              </div>
            </div>
            <h1 style={{...F.title,fontSize:22,fontWeight:700,color:C.black}}>ENTRAR</h1>
            <p style={{...F.body,fontSize:13,color:C.gray500,marginTop:4}}>Acesse sua conta para continuar</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>E-mail</label>
              <input value={email} onChange={e=>setE(e.target.value)} placeholder="seu@email.com"
                style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",...F.body,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Senha</label>
              <div style={{position:"relative"}}>
                <input type={verPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"
                  style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 40px 10px 12px",...F.body,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
                <button type="button" onClick={()=>setVerPw(v=>!v)} title={verPw?"Ocultar senha":"Mostrar senha"}
                  style={{position:"absolute",right:8,top:0,bottom:0,background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:"0 4px"}}>
                  <Ic n={verPw?"eyeOff":"eye"} s={18} c={C.gray400}/>
                </button>
              </div>
            </div>
            {err&&<div style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>{err}</div>}
            <button onClick={go} disabled={loading} style={{background:loading?C.gray400:C.red,color:C.white,border:"none",borderRadius:6,padding:"11px",...F.title,fontSize:14,fontWeight:700,cursor:loading?"wait":"pointer",letterSpacing:"0.06em",marginTop:4}}>{loading?"ENTRANDO...":"ENTRAR"}</button>
          </div>
  
        </div>
      </div>
    </div>
  );
}

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state={hasError:false,msg:""}; }
  static getDerivedStateFromError(error){ return {hasError:true,msg:error?.message||String(error)}; }
  componentDidCatch(error,info){ console.error("SGP crash:",error,info); }
  render(){
    if(this.state.hasError){
      return (
        <div style={{padding:40,fontFamily:"sans-serif",maxWidth:600,margin:"40px auto"}}>
          <h2 style={{color:"#9E0B0F",fontSize:20,marginBottom:12}}>Ops, algo quebrou</h2>
          <p style={{color:"#666",fontSize:14,marginBottom:16}}>Detalhe técnico do erro:</p>
          <pre style={{background:"#f5f5f5",padding:16,borderRadius:8,fontSize:12,overflow:"auto",color:"#9E0B0F"}}>{this.state.msg}</pre>
          <button onClick={()=>{try{sessionStorage.clear();}catch{};window.location.reload();}}
            style={{marginTop:16,background:"#9E0B0F",color:"#fff",border:"none",borderRadius:6,padding:"10px 20px",cursor:"pointer",fontSize:14,fontWeight:700}}>
            Limpar sessão e recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
let _refreshListeners=[];
function triggerRefresh(){ _refreshListeners.forEach(fn=>fn()); }

// Página de Bordado Externo: gráfico de lotação por bordador + filtro + fila
// Página FINALIZADOS (menu) — busca do endpoint /finalizados (pedidos faturados),
// NÃO do snapshot (que só tem os em aberto). Era por isso que a aba do menu vinha
// vazia enquanto a do Dashboard mostrava.
function FinalizadosPage({onOpen}){
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [erro,setErro]=useState("");
  const [busca,setBusca]=useState("");
  const carregar=()=>{ setLoading(true); setErro("");
    apiFetch("/finalizados").then(r=>{ setData(r.success?(r.data||[]):[]); if(!r.success)setErro(r.error||"Erro ao carregar."); })
      .catch(e=>setErro(e.message)).finally(()=>setLoading(false)); };
  useEffect(()=>{carregar();},[]);
  const q=busca.trim().toLowerCase();
  const lista=(data||[]).filter(o=> !q || (((o.client||"")+" "+(o.pedidoLinx||"")+" "+(o.vendasId||"")+" "+(o.cnpj||"")).toLowerCase().includes(q)));
  return (
    <div style={{padding:24}}>
      <PageH title="Finalizados" sub={`${(data||[]).length} pedido${(data||[]).length!==1?"s":""} faturado${(data||[]).length!==1?"s":""}`} onRefresh={carregar} refreshing={loading}/>
      <div style={{position:"relative",marginBottom:16,maxWidth:420}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={15} c={C.gray400}/></div>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido Linx, ID ou CNPJ..."
          style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px 10px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      </div>
      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue,marginBottom:12}}>Carregando finalizados...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:12}}>Erro: {erro}</div>}
      {!loading&&!erro&&lista.length===0&&<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",padding:60,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>{q?"Nenhum pedido encontrado.":"Nenhum pedido finalizado."}</div>}
      {lista.map(o=>{
        const st=(o.statusFaturamento||"").toLowerCase();
        const fat=st.includes("parcial")?{lbl:"FATURADO PARCIAL",cor:"#92400e",bg:C.amber+"20"}:st.includes("faturado")?{lbl:"FATURADO",cor:"#065f46",bg:C.green+"18"}:{lbl:"FINALIZADO",cor:C.gray600,bg:C.gray100};
        return (
          <Card key={o.id} especial={temDataEspecial(o)} onClick={()=>onOpen(normalizarCard(o,"Finalizado"))}
            style={{marginBottom:10,borderLeft:`4px solid ${C.green}`,cursor:"pointer",transition:"box-shadow 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="";}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div style={{minWidth:0,flex:1}}>
                <div style={{...F.body,fontWeight:700,fontSize:14}}>{idPedido(o)}</div>
                <div style={{...F.body,fontSize:13,color:C.gray700,marginTop:2}}>{o.client||"—"}</div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:3}}>{fmtR(o.valor)}{o.centroCusto?` · ${rotuloCentroCusto(o.centroCusto)}`:""}</div>
              </div>
              <span style={{...F.title,fontSize:10,fontWeight:800,letterSpacing:"0.05em",padding:"4px 10px",borderRadius:6,background:fat.bg,color:fat.cor,border:`1px solid ${fat.cor}33`,whiteSpace:"nowrap"}}>{fat.lbl}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BordadoExternoPage({orders,onOpen,slaCfg}){
  const [capLot,setCapLot]=useState({capacidade:{},lotacao:{}});
  const [lotLoading,setLotLoading]=useState(true);
  const [filtro,setFiltro]=useState("todos");
  useEffect(()=>{
    const load=()=>{setLotLoading(true);return apiFetch("/capacidade-lotacao").then(r=>{if(r.success)setCapLot({capacidade:r.capacidade||{},lotacao:r.lotacao||{}});}).catch(()=>{}).finally(()=>setLotLoading(false));};
    load();
    _refreshListeners.push(load);
    return ()=>{_refreshListeners=_refreshListeners.filter(f=>f!==load);};
  },[]);
  const FILT=[["todos","Todos",C.gray600],["bordadel","Bordadel",C.red],["mg_bordados","MG Bordados","#7c3aed"],["outros","Outros",C.amber]];
  const topoExtra=(
    <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:12}}>
      <PainelLotacao capLot={capLot} carregando={lotLoading} destinos={["bordadel","mg_bordados","outros"]} titulo="Lotação dos bordadores externos (peças em aberto)"/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{...F.body,fontSize:12,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.05em",marginRight:2}}>Bordador:</span>
        {FILT.map(([id,lbl,cor])=>(
          <button key={id} onClick={()=>setFiltro(id)}
            style={{padding:"7px 13px",borderRadius:7,border:`1.5px solid ${filtro===id?cor:C.gray200}`,background:filtro===id?cor+"12":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:filtro===id?700:500,color:filtro===id?cor:C.gray600}}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
  return <Fila title="Bordado Externo" etapa="Bordado Externo" endpoint="/bordado-externo" orders={orders} onOpen={onOpen} actionLabel="Registrar retorno" actionColor={C.purple} slaCfg={slaCfg} filtroBordador={filtro} topoExtra={topoExtra}/>;
}

// ─── CADASTRO DE CÓDIGOS DE BARRA ─────────────────────────────────────────────
function CodigosBarra({user}){
  const [busca,setBusca]=useState("");
  const [buscaAtiva,setBuscaAtiva]=useState("");
  const [page,setPage]=useState(0);
  const [data,setData]=useState([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(false);
  const [erro,setErro]=useState("");
  const [form,setForm]=useState({codigo_barra:"",produto:"",grade:""});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState(null); // {tipo:"ok"|"err", texto}
  const LIMIT=50;

  const carregar=()=>{
    setLoading(true);setErro("");
    const qs=`?busca=${encodeURIComponent(buscaAtiva)}&page=${page}&limit=${LIMIT}`;
    apiFetch("/codigos"+qs)
      .then(r=>{ if(r.success){setData(r.data||[]);setTotal(r.total||0);} else setErro(r.error||"Erro ao carregar."); })
      .catch(e=>setErro(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[buscaAtiva,page]);

  const fazerBusca=()=>{ setPage(0); setBuscaAtiva(busca.trim()); };
  const cadastrar=async()=>{
    const codigo=form.codigo_barra.trim(), produto=form.produto.trim(), grade=form.grade.trim();
    if(!codigo){setMsg({tipo:"err",texto:"Informe o código de barra."});return;}
    if(!produto){setMsg({tipo:"err",texto:"Informe o produto."});return;}
    setSaving(true);setMsg(null);
    try{
      const r=await apiFetch("/codigos","POST",{codigo_barra:codigo,produto,grade,criadoPor:user?.email||user?.nome||""});
      if(r.error) throw new Error(r.error);
      setMsg({tipo:"ok",texto:`Código ${codigo} cadastrado.`});
      setForm({codigo_barra:"",produto:"",grade:""});
      if(page===0&&!buscaAtiva) carregar(); else {setPage(0);setBuscaAtiva("");}
    }catch(e){ setMsg({tipo:"err",texto:e.message}); }
    finally{ setSaving(false); }
  };

  const totalPages=Math.max(1,Math.ceil(total/LIMIT));
  const inp={width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"};

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <PageH title="Códigos de Barra" sub={`${total.toLocaleString("pt-BR")} códigos cadastrados`} onRefresh={carregar} refreshing={loading}/>

      {/* Cadastro de novo código */}
      <Card>
        <SecH>Cadastrar novo código</SecH>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 0.7fr auto",gap:10,alignItems:"end",flexWrap:"wrap"}}>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:5}}>Código de barra</label>
            <input value={form.codigo_barra} onChange={e=>setForm(f=>({...f,codigo_barra:e.target.value}))} placeholder="o que o leitor lê" style={inp}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:5}}>Produto</label>
            <input value={form.produto} onChange={e=>setForm(f=>({...f,produto:e.target.value}))} placeholder="ex.: 01.02.0051" style={inp}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:5}}>Grade</label>
            <input value={form.grade} onChange={e=>setForm(f=>({...f,grade:e.target.value}))} placeholder="ex.: 43" style={inp}/>
          </div>
          <button onClick={cadastrar} disabled={saving}
            style={{background:saving?C.gray300:C.green,color:C.white,border:"none",borderRadius:7,padding:"10px 18px",cursor:saving?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
            <Ic n="check" s={14} c={C.white}/>{saving?"Salvando...":"Cadastrar"}
          </button>
        </div>
        {msg&&<div style={{marginTop:12,...F.body,fontSize:13,fontWeight:600,color:msg.tipo==="ok"?C.green:C.red,display:"flex",alignItems:"center",gap:6}}>
          <Ic n={msg.tipo==="ok"?"check":"warn"} s={14} c={msg.tipo==="ok"?C.green:C.red}/>{msg.texto}
        </div>}
      </Card>

      {/* Lista / busca */}
      <Card>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:220}}>
            <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={15} c={C.gray400}/></div>
            <input value={busca} onChange={e=>setBusca(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")fazerBusca();}}
              placeholder="Buscar por código, produto ou grade..." style={{...inp,paddingLeft:36}}/>
          </div>
          <button onClick={fazerBusca} style={{background:C.red,color:C.white,border:"none",borderRadius:7,padding:"9px 18px",cursor:"pointer",fontWeight:700,fontSize:13,...F.body}}>Buscar</button>
          {buscaAtiva&&<button onClick={()=>{setBusca("");setBuscaAtiva("");setPage(0);}} style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"9px 14px",cursor:"pointer",fontSize:13,...F.body}}>Limpar</button>}
        </div>

        {erro&&<div style={{...F.body,fontSize:13,color:C.red,marginBottom:10}}><Ic n="warn" s={14} c={C.red}/> {erro}</div>}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${C.gray200}`}}>{["Código de barra","Produto","Grade","Cadastrado"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body}}>{h}</th>)}</tr></thead>
            <tbody>
              {data.length===0&&!loading&&<tr><td colSpan={4} style={{padding:"18px 10px",...F.body,color:C.gray400,fontSize:13}}>{buscaAtiva?"Nenhum código encontrado para a busca.":"Nenhum código cadastrado ainda."}</td></tr>}
              {data.map((r,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                  <td style={{padding:"8px 10px",fontFamily:"monospace",fontWeight:700,color:C.gray800}}>{r.codigo_barra}</td>
                  <td style={{padding:"8px 10px",...F.body,fontWeight:600}}>{r.produto}</td>
                  <td style={{padding:"8px 10px",...F.body,color:C.gray600}}>{r.grade||"—"}</td>
                  <td style={{padding:"8px 10px",...F.body,color:C.gray400,fontSize:11}}>{r.criado_em?new Date(r.criado_em).toLocaleDateString("pt-BR"):"—"}{r.criado_por?` · ${r.criado_por}`:""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {total>LIMIT&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,...F.body,fontSize:13,color:C.gray600}}>
          <span>Página {page+1} de {totalPages.toLocaleString("pt-BR")}</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
              style={{background:C.white,color:page===0?C.gray300:C.gray700,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"6px 14px",cursor:page===0?"not-allowed":"pointer",fontSize:13,...F.body}}>Anterior</button>
            <button onClick={()=>setPage(p=>(p+1<totalPages?p+1:p))} disabled={page+1>=totalPages}
              style={{background:C.white,color:page+1>=totalPages?C.gray300:C.gray700,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"6px 14px",cursor:page+1>=totalPages?"not-allowed":"pointer",fontSize:13,...F.body}}>Próxima</button>
          </div>
        </div>}
      </Card>
    </div>
  );
}

// ─── IMPRESSÃO DE PEDIDO (folha de separação) ────────────────────────────────
function Folha({emit,o,fmtDt}){
  // Linhas de PERSONALIZAÇÃO (bordado/arte/silk/DTF) não são peça física — o WMS
  // nunca as separa. Ficam listadas como informação, mas NÃO entram na contagem
  // de peças nem no status do pedido (senão o total fica inflado, ex.: 9/18).
  const ehPers=(p)=>p.naoSeparavel===true||p.statusProduto==="personalizacao";
  const produtosSep=(o.produtos||[]).filter(p=>!ehPers(p));
  const totalPecas=produtosSep.reduce((s,p)=>s+(p.total||0),0);
  const totalSeparado=produtosSep.reduce((s,p)=>s+(p.totalSeparado||0),0);
  const status=o.statusSeparacao||"pendente";
  // Cores escurecidas — impressão B&W fica legível
  const STATUS_CFG={
    completa: {lbl:"PEDIDO COMPLETO",         sub:"TODAS AS PEÇAS SEPARADAS",                                                    cor:"#0d4d24",bg:"#e8f5ec",bd:"#4a8f5f", simb:"✓"},
    parcial:  {lbl:"PEDIDO SEPARADO PARCIAL", sub:totalPecas>0?`${totalSeparado} DE ${totalPecas} PEÇAS SEPARADAS`:"ATENÇÃO: HÁ PEÇAS PENDENTES", cor:"#7a2a06",bg:"#fce8d5",bd:"#c46a2f", simb:"P"},
    pendente: {lbl:"SEPARAÇÃO PENDENTE",      sub:"NENHUMA PEÇA FOI SEPARADA AINDA",                                             cor:"#5c0f0f",bg:"#f5d5d5",bd:"#9e3d3d", simb:"✗"},
  };
  const st=STATUS_CFG[status]||STATUS_CFG.pendente;
  const ehImg=(n="")=>/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(n);
  const limpaNome=(n="")=>n.replace(/\s*~(PROG|AMOSTRA)/gi,"").trim()||n;
  // Amber e roxo mais escuros pra B&W
  const AMBER={cor:"#5a2a06",bg:"#faedcf",bd:"#a67a1a"};
  const ROXO ={cor:"#3b1173",bg:"#ece7f5",bd:"#4a2b7a"};
  // Caixinha padronizada com símbolo dentro — check ✓ pra separado, ✗ pra pendente, P pra parcial
  const Box=({simb,cor,tam=14})=>(
    <span style={{
      display:"inline-flex",alignItems:"center",justifyContent:"center",
      width:tam,height:tam,border:`2px solid ${cor}`,borderRadius:2,
      fontSize:simb==="P"?tam-4:tam-2,
      fontWeight:900,color:cor,lineHeight:1,
      fontFamily:simb==="P"?"'Oswald',monospace":"Arial,sans-serif",
      flexShrink:0,
    }}>{simb}</span>
  );
  const pilProduto=(p)=>{
    // Linha de personalização (bordado/arte/silk/DTF): não é peça separável,
    // então nunca aparece como PENDENTE na folha.
    if(p.statusProduto==="personalizacao"||p.naoSeparavel) return {lbl:"PERSONALIZAÇÃO",cor:"#4b2673",bg:"#efe8f7",bd:"#7c4bb8", simb:"◆"};
    if(p.statusProduto==="completo")return {lbl:"SEPARADO",cor:"#0d4d24",bg:"#e8f5ec",bd:"#4a8f5f", simb:"✓"};
    if(p.statusProduto==="parcial") return {lbl:`PARCIAL ${p.gradesSeparadas||0}/${p.qtdGrades||0}`,cor:"#7a2a06",bg:"#fce8d5",bd:"#c46a2f", simb:"P"};
    return {lbl:"PENDENTE",cor:"#5c0f0f",bg:"#f5d5d5",bd:"#9e3d3d", simb:"✗"};
  };
  return(
    <div className="folha-print" style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,boxShadow:"0 2px 12px rgba(0,0,0,0.08)",width:"100%",maxWidth:820,padding:32,boxSizing:"border-box",color:"#000"}}>
      {/* Aviso: pedido antigo/sem integração — folha com line items */}
      {o.usouFallback && <div className="produto-row" style={{marginBottom:12,background:"#faedcf",border:"1.5px dashed #a67a1a",borderRadius:8,padding:"9px 12px",...F.body,fontSize:11.5,color:"#5a2a06",fontWeight:700,lineHeight:1.4}}>
        <strong>⚠ Pedido sem Pedidos Aprovados no ERP.</strong> Folha montada com line items do deal — sem status de separação por item (todos aparecem como pendentes).
      </div>}

      {/* Cabeçalho */}
      <div className="produto-row" style={{display:"flex",alignItems:"center",gap:16,borderBottom:`2px solid #555`,paddingBottom:14,marginBottom:14}}>
        {emit.logoUrl
          ?<img src={emit.logoUrl} alt="" style={{height:44,objectFit:"contain"}}/>
          :<div style={{...F.title,fontSize:20,fontWeight:800,color:"#7a0007",whiteSpace:"nowrap"}}>{emit.razaoSocial||"CITEROL"}</div>}
        <div style={{flex:1,minWidth:0}}>
          {emit.logoUrl&&<div style={{...F.title,fontSize:15,fontWeight:800,color:"#000"}}>{emit.razaoSocial}</div>}
          {emit.cnpj&&<div style={{...F.body,fontSize:11,color:"#333",fontWeight:600}}>CNPJ: {emit.cnpj}</div>}
          {emit.endereco&&<div style={{...F.body,fontSize:11,color:"#333",fontWeight:600}}>{emit.endereco}</div>}
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{...F.title,fontSize:10,fontWeight:700,color:"#333",letterSpacing:"0.1em"}}>FOLHA DE PROCESSAMENTO</div>
          <div style={{...F.title,fontSize:18,fontWeight:800,color:"#000"}}>
            {o.pedidoLinx ? <>PED {o.pedidoLinx} <span style={{fontSize:12,color:"#555",fontWeight:600}}>| {o.pedido}</span></> : <>PED {o.pedido}</>}
          </div>
          {o.data&&<div style={{...F.body,fontSize:11,color:"#333",fontWeight:600}}>{fmtDt(o.data)}</div>}
        </div>
      </div>

      {/* Banner de status — caixinha com símbolo pra distinguir sem cor */}
      <div className="produto-row" style={{marginBottom:14,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,border:`2px solid ${st.bd}`,background:st.bg,color:st.cor}}>
        <div style={{display:"flex",alignItems:"center",flex:1,gap:12}}>
          <Box simb={st.simb} cor={st.cor} tam={26}/>
          <div>
            <div style={{...F.title,fontSize:18,fontWeight:800,letterSpacing:"0.04em"}}>{st.lbl}</div>
            <div style={{...F.title,fontSize:11,fontWeight:700,marginTop:3,letterSpacing:"0.05em"}}>{st.sub}</div>
          </div>
        </div>
        <div style={{...F.body,textAlign:"right",fontSize:12,fontWeight:800}}>{totalSeparado} / {totalPecas} peças</div>
      </div>

      {/* Legenda de símbolos — pra impressão B&W */}
      <div style={{display:"flex",gap:14,fontSize:10,fontWeight:700,color:"#333",marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:5}}><Box simb="✓" cor="#0d4d24" tam={12}/> SEPARADO</span>
        <span style={{display:"inline-flex",alignItems:"center",gap:5}}><Box simb="✗" cor="#5c0f0f" tam={12}/> PENDENTE</span>
        <span style={{display:"inline-flex",alignItems:"center",gap:5}}><Box simb="P" cor="#7a2a06" tam={12}/> PARCIAL</span>
      </div>

      {/* OCORRÊNCIA: tarja no topo da folha. Quem separa precisa saber de cara que
          é peça devolvida, não pedido novo — por isso vem antes dos dados do cliente. */}
      {o.ehOcorrencia&&<div className="produto-row" style={{background:"#fde8e8",border:"2px solid #c0392b",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{...F.title,fontSize:13,fontWeight:800,letterSpacing:"0.08em",color:"#fff",background:"#c0392b",padding:"4px 12px",borderRadius:5}}>PEDIDO DE OCORRÊNCIA</span>
          {o.ocorrenciaTipo&&<span style={{...F.body,fontSize:12,fontWeight:800,color:"#7a1c12"}}>{o.ocorrenciaTipo}</span>}
        </div>
        {o.ocorrenciaRelato&&<div style={{...F.body,fontSize:11,color:"#3a1210",marginTop:6,fontWeight:600,lineHeight:1.45}}>
          <b>Relato do cliente:</b> {o.ocorrenciaRelato}
        </div>}
        {o.ocorrenciaMotivo&&<div style={{...F.body,fontSize:11,color:"#3a1210",marginTop:3,fontWeight:600,lineHeight:1.45}}>
          <b>Parecer da qualidade:</b> {o.ocorrenciaMotivo}
        </div>}
      </div>}

      {/* Cliente — bloco em formato de FICHA (tabela).
          Antes era um parágrafo corrido com tudo separado por "·": na folha
          impressa, quem confere tinha que caçar o CNPJ no meio da linha.
          Agora cada dado tem rótulo e linha própria, alinhados em coluna. */}
      <div className="produto-row" style={{border:"1px solid #b0b0b0",borderRadius:8,marginBottom:14,overflow:"hidden"}}>
        {/* Faixa do topo: nome do cliente + clifor + selos */}
        <div style={{background:"#e4e4e4",borderBottom:"1px solid #b0b0b0",padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{minWidth:0,flex:1,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{...F.body,fontSize:9.5,color:"#444",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>Cliente</span>
            <span style={{...F.body,fontSize:14.5,fontWeight:800,color:"#000",lineHeight:1.2}}>{o.cliente||"—"}</span>
            {o.clifor&&<span style={{...F.body,fontSize:11,fontWeight:700,color:"#111",background:"#fff",border:"1px solid #999",borderRadius:5,padding:"1px 7px",whiteSpace:"nowrap"}}>Clifor {o.clifor}</span>}
          </div>
          {(() => {
            const rot=rotuloCentroCusto(o.centroCusto);
            const sl=rot.toLowerCase();
            const tipo=(rot||"CORPORATIVO").toUpperCase();
            const ehConcess=/concession/.test(sl);
            const ehLicit=/licita/.test(sl);
            const ehB2B=/b2b/.test(sl);
            const cor=ehConcess?"#3b1173":ehLicit?"#7a2a06":ehB2B?"#0e4f6e":"#0d4d24";
            const bg =ehConcess?"#ece7f5":ehLicit?"#fce8d5":ehB2B?"#e2f1f8":"#e8f5ec";
            const bd =ehConcess?"#4a2b7a":ehLicit?"#c46a2f":ehB2B?"#3a86ad":"#4a8f5f";
            return (
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                <span style={{...F.title,fontSize:10.5,fontWeight:800,letterSpacing:"0.05em",padding:"4px 9px",borderRadius:6,background:bg,color:cor,border:`1.5px solid ${bd}`,whiteSpace:"nowrap"}}>{tipo}</span>
                {o.tipo&&<span style={{...F.title,fontSize:9.5,fontWeight:800,letterSpacing:"0.05em",padding:"3px 8px",borderRadius:6,background:"#fff",color:"#333",border:"1.5px solid #b0b0b0",whiteSpace:"nowrap"}}>{String(o.tipo).toUpperCase()}</span>}
              </div>
            );
          })()}
        </div>
        {/* Ficha: uma informação por linha, rótulo à esquerda.
            Campos vazios não geram linha — a ficha não fica com buracos. */}
        {(() => {
          const razaoDif = o.razaoSocial && o.razaoSocial.trim()
            && o.razaoSocial.trim().toLowerCase() !== String(o.cliente||"").trim().toLowerCase();
          const linhas = [];
          if (razaoDif) linhas.push([["Razão social", o.razaoSocial]]);
          const doc = [];
          if (o.cnpj) doc.push(["CNPJ", o.cnpj]);
          if (o.inscricaoEstadual) doc.push(["Inscrição estadual", o.inscricaoEstadual]);
          if (doc.length) linhas.push(doc);
          if (o.endereco) linhas.push([["Endereço", o.endereco]]);
          const com = [];
          if (o.representante) com.push(["Representante", o.representante]);
          if (o.condicaoPagamento) com.push(["Condição de pagamento", o.condicaoPagamento]);
          if (com.length) linhas.push(com);
          if (!linhas.length) return null;
          const tdRot = {...F.body,fontSize:9,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.06em",
            padding:"5px 10px",whiteSpace:"nowrap",verticalAlign:"middle",background:"#f7f7f7",width:1};
          const tdVal = {...F.body,fontSize:11.5,fontWeight:700,color:"#000",padding:"5px 10px",verticalAlign:"middle",wordBreak:"break-word"};
          return (
            <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"auto"}}>
              <tbody>
                {linhas.map((par,i)=>(
                  <tr key={i} style={{borderTop:i===0?"none":"1px solid #d5d5d5"}}>
                    {par.map(([rot,val],j)=>(
                      <Fragment key={j}>
                        <td style={{...tdRot,borderLeft:j>0?"1px solid #d5d5d5":"none"}}>{rot}</td>
                        <td style={tdVal} colSpan={par.length===1?3:1}>{val}</td>
                      </Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })()}
      </div>

      {/* Produtos */}
      <div style={{...F.title,fontSize:12,fontWeight:700,color:"#333",letterSpacing:"0.1em",textTransform:"uppercase",margin:"4px 0 8px",borderBottom:"1px solid #c0c0c0",paddingBottom:4}}>Produtos ({(o.produtos||[]).length})</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {(o.produtos||[]).map((p,i)=>{
          const pil=pilProduto(p);
          return (
          <div key={i} className="produto-row" style={{display:"flex",gap:12,alignItems:"stretch",border:"1px solid #555",borderRadius:8,padding:8}}>
            {/* Foto menor: 60px (era 84px) */}
            <div style={{width:60,height:60,border:"1px solid #c0c0c0",borderRadius:6,background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
              {p.foto?<img src={p.foto} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<span style={{...F.body,fontSize:9,color:"#555",fontWeight:700}}>sem foto</span>}
            </div>
            <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                <span style={{...F.body,fontSize:10,color:"#333",fontWeight:800,fontFamily:"monospace"}}>{p.sku}</span>
                <span style={{...F.title,fontSize:9.5,fontWeight:800,letterSpacing:"0.05em",padding:"2px 7px",borderRadius:4,background:pil.bg,color:pil.cor,border:`1.5px solid ${pil.bd}`,display:"inline-flex",alignItems:"center",gap:5}}>
                  <Box simb={pil.simb} cor={pil.cor} tam={12}/> {pil.lbl}
                </span>
              </div>
              <div style={{...F.title,fontSize:14,fontWeight:800,color:"#000",lineHeight:1.15}}>{p.nome}</div>
              {/* Grades com caixinha ✓/✗/parcial. Se qtd_separada < qtd, mostra "X de Y" */}
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:3}}>
                {(p.grades||[]).map((g,j)=>{
                  const st=g.statusGrade||(g.separado?"completa":"pendente");
                  const gCor=st==="completa"?"#0d4d24":st==="parcial"?"#7a2a06":"#5c0f0f";
                  const gBg =st==="completa"?"#e8f5ec":st==="parcial"?"#fce8d5":"#fff";
                  const gBd =st==="completa"?"1.5px solid #4a8f5f":st==="parcial"?"1.5px solid #c46a2f":"2px dashed #5c0f0f";
                  const simb=st==="completa"?"✓":st==="parcial"?"P":"✗";
                  const qtdSep=g.qtdSeparada!=null?g.qtdSeparada:(g.separado?g.qtd:0);
                  return (
                    <span key={j} style={{
                      ...F.body,fontSize:11,fontWeight:700,
                      background:gBg,color:st==="completa"?"#0d4d24":"#000",
                      border:gBd,borderRadius:4,padding:"2px 8px",
                      display:"inline-flex",alignItems:"center",gap:5,
                    }}>
                      <Box simb={simb} cor={gCor} tam={12}/>
                      {g.tamanho||"—"}: <strong>{
                        st==="parcial" ? `${qtdSep}/${g.qtd}` : g.qtd
                      }</strong>
                    </span>
                  );
                })}
              </div>
              {p.descricao&&<div style={{marginTop:5,background:AMBER.bg,borderLeft:`4px solid ${AMBER.bd}`,borderRadius:4,padding:"5px 8px",...F.body,fontSize:11,color:"#000",fontWeight:600,lineHeight:1.35,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                <span style={{...F.title,fontSize:10,color:AMBER.cor,fontWeight:800,letterSpacing:"0.05em"}}>[OBS]</span> {p.descricao}
              </div>}
            </div>
            <div style={{textAlign:"center",flexShrink:0,paddingLeft:10,borderLeft:"1px solid #c0c0c0",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:78}}>
              <div style={{...F.body,fontSize:9,color:"#333",fontWeight:800}}>TOTAL</div>
              <div style={{...F.title,fontSize:20,fontWeight:800,color:"#000",lineHeight:1}}>{p.total||0}</div>
              {p.totalSeparado>0&&p.totalSeparado<p.total&&<div style={{...F.body,fontSize:9,color:"#7a2a06",fontWeight:800,marginTop:4}}>{p.totalSeparado}/{p.total} SEP.<br/>SALDO: {p.total-p.totalSeparado}</div>}
              {p.totalSeparado>=p.total&&p.total>0&&<div style={{...F.body,fontSize:9,color:"#0d4d24",fontWeight:800,marginTop:4}}>COMPLETO</div>}
            </div>
          </div>
          );
        })}
      </div>

      {/* Bordados — agrupados por arquivo (1 card por arquivo, com a lista de
          produto + posição de cada produto que usa o mesmo arquivo). */}
      {(o.bordados||[]).length>0 && (() => {
        const grupos={};
        for(const b of o.bordados){
          const fid=b.fileId?String(b.fileId):("nome:"+(b.fileName||""));
          if(!grupos[fid]) grupos[fid]={rep:b,combos:[],obsP:"",obsB:""};
          const g=grupos[fid];
          const key=((b.sku||b.productName||"")+"|"+(b.positionLabel||""));
          if(!g.combos.some(c=>c.key===key)) g.combos.push({key,productName:b.productName||"",sku:b.sku||"",positionLabel:b.positionLabel||""});
          if(b.obs_programacao&&!g.obsP) g.obsP=b.obs_programacao;
          if(b.obs_bordado&&!g.obsB) g.obsB=b.obs_bordado;
        }
        const lista=Object.values(grupos);
        return <>
          <div style={{...F.title,fontSize:12,fontWeight:700,color:"#333",letterSpacing:"0.1em",textTransform:"uppercase",margin:"16px 0 8px",borderBottom:"1px solid #c0c0c0",paddingBottom:4}}>Bordados ({lista.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {lista.map((g,i)=>(
              <div key={i} className="produto-row" style={{border:"1px solid #555",borderRadius:8,padding:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:56,height:56,border:"1px solid #c0c0c0",borderRadius:6,background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                  {g.rep.fileUrl&&ehImg(g.rep.fileName)
                    ?<img src={g.rep.fileUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                    :<span style={{fontSize:20,color:"#555",fontWeight:700}}>🧵</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{...F.title,fontSize:12,fontWeight:800,lineHeight:1.2,wordBreak:"break-word",color:"#000"}}>{limpaNome(g.rep.fileName)}</div>
                  <div style={{marginTop:3,display:"flex",flexDirection:"column",gap:2}}>
                    {g.combos.map((c,ci)=>(
                      <div key={ci} style={{...F.body,fontSize:10.5,color:"#222",fontWeight:700}}>
                        👕 {c.productName||c.sku}{c.positionLabel?<> · 📍 {c.positionLabel}</>:null}
                      </div>
                    ))}
                  </div>
                  {g.obsP&&<div style={{marginTop:5,background:AMBER.bg,borderLeft:`4px solid ${AMBER.bd}`,borderRadius:4,padding:"5px 8px",...F.body,fontSize:11,lineHeight:1.35,color:"#000",fontWeight:600,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                    <span style={{...F.title,fontSize:10,color:AMBER.cor,fontWeight:800,letterSpacing:"0.02em"}}>[PROGRAMAÇÃO]</span> {g.obsP}
                  </div>}
                  {g.obsB&&<div style={{marginTop:5,background:AMBER.bg,borderLeft:`4px solid ${AMBER.bd}`,borderRadius:4,padding:"5px 8px",...F.body,fontSize:11,lineHeight:1.35,color:"#000",fontWeight:600,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                    <span style={{...F.title,fontSize:10,color:AMBER.cor,fontWeight:800,letterSpacing:"0.02em"}}>[BORDADO]</span> {g.obsB}
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </>;
      })()}

      {/* Observações do pedido — vindas do deal de Vendas */}
      {(o.infoImportante||o.dadosAdicionais) && <>
        <div style={{...F.title,fontSize:12,fontWeight:700,color:"#333",letterSpacing:"0.1em",textTransform:"uppercase",margin:"16px 0 8px",borderBottom:"1px solid #c0c0c0",paddingBottom:4}}>Observações do Pedido</div>
        {o.infoImportante&&<div className="produto-row" style={{background:AMBER.bg,border:`1px solid #555`,borderLeft:`5px solid ${AMBER.bd}`,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
          <div style={{...F.title,fontSize:10,color:AMBER.cor,fontWeight:800,letterSpacing:"0.08em",marginBottom:4,textTransform:"uppercase"}}>Informação importante do pedido</div>
          <div style={{...F.body,fontSize:12,color:"#000",lineHeight:1.4,whiteSpace:"pre-wrap",wordBreak:"break-word",fontWeight:600}}>{o.infoImportante}</div>
        </div>}
        {o.dadosAdicionais&&<div className="produto-row" style={{background:ROXO.bg,border:`1px solid ${ROXO.bd}`,borderLeft:`5px solid ${ROXO.bd}`,borderRadius:8,padding:"10px 12px"}}>
          <div style={{...F.title,fontSize:10,color:ROXO.cor,fontWeight:800,letterSpacing:"0.08em",marginBottom:4,textTransform:"uppercase"}}>Dados adicionais</div>
          <div style={{...F.body,fontSize:12,color:"#000",lineHeight:1.4,whiteSpace:"pre-wrap",wordBreak:"break-word",fontWeight:600}}>{o.dadosAdicionais}</div>
        </div>}
      </>}

      <div className="produto-row" style={{marginTop:14,paddingTop:10,borderTop:"2px solid #555",display:"flex",justifyContent:"space-between",alignItems:"center",...F.body,fontSize:13,fontWeight:800,flexWrap:"wrap",gap:8}}>
        <span>{(o.produtos||[]).length} produto(s){(o.bordados||[]).length?` · ${o.bordados.length} bordado(s)`:""}</span>
        <span style={{color:"#000"}}>Total de peças: <strong>{totalPecas}</strong></span>
        <span style={{color:"#000"}}>Frete: <strong>{fmtR(o.valorFrete||0)}</strong></span>
        {o.valorTotal>0&&<span style={{color:"#7a0007",fontSize:15}}>Valor total: <strong>{fmtR(o.valorTotal)}</strong></span>}
      </div>
      {o.transportadora&&<div className="produto-row" style={{marginTop:8,paddingTop:8,borderTop:"1px solid #c0c0c0",...F.body,fontSize:12.5,color:"#333",fontWeight:700}}>
        🚚 Transportadora: <strong style={{color:"#000"}}>{o.transportadora}</strong>
      </div>}
    </div>
  );
}

function AguardandoOutroPedido({user}){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState(null);
  const [motivoRetorno,setMotivoRetorno]=useState("");
  const [msg,setMsg]=useState("");
  const carregar=()=>{ setLoading(true); apiFetch("/aguardando-outro-pedido").then(r=>{ if(r.success)setItems(r.items||[]); }).finally(()=>setLoading(false)); };
  useEffect(()=>{ carregar(); },[]);
  const fmtH=(h)=>{ if(h<1)return `${Math.round(h*60)}min`; if(h<24)return `${h.toFixed(1)}h`; return `${Math.floor(h/24)}d ${Math.round(h%24)}h`; };
  const confirmarRetorno=async()=>{
    if(!selected)return;
    if(!motivoRetorno.trim()){alert("Motivo do retorno é obrigatório."); return;}
    try{
      const r=await apiFetch("/aguardando-outro-pedido/sair","POST",{
        dealId: selected.posvendaId || selected.bordadoId,
        motivo: motivoRetorno.trim(),
        ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if(r.success){
        setMsg(`Retornado. Ficou ${(r.horasNessaEspera||0).toFixed(1)}h em espera.`);
        setSelected(null); setMotivoRetorno(""); carregar();
        setTimeout(()=>setMsg(""),4000);
      } else alert("Erro: "+(r.error||"desconhecido"));
    }catch(e){alert("Erro: "+e.message);}
  };
  return(
    <div style={{padding:24}}>
      <PageH title="Aguardando Outro Pedido" sub="Pedidos que dependem de outro para prosseguir (faturamento conjunto, material atrelado, etc)."/>
      {msg&&<div style={{background:C.green+"12",border:`1px solid ${C.green}30`,color:C.green,padding:"10px 14px",borderRadius:6,marginBottom:14,...F.body,fontSize:13,fontWeight:700}}>✓ {msg}</div>}
      {loading?<div style={{padding:40,textAlign:"center",...F.body,color:C.gray400}}>Carregando...</div>
       :items.length===0?<Card><div style={{padding:40,textAlign:"center",...F.body,color:C.gray500}}>Nenhum pedido aguardando outro no momento.</div></Card>
       :<div style={{display:"flex",flexDirection:"column",gap:10}}>
         {items.map(o=>(
           <div key={o.id} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:14,borderLeft:`4px solid ${C.blue}`}}>
             <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8,flexWrap:"wrap"}}>
               <div style={{minWidth:0,flex:1}}>
                 <div style={{...F.body,fontSize:14,fontWeight:700,color:C.black}}>PED - {o.vendasId}</div>
                 <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:2}}>{o.client}</div>
                 <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:4}}>
                   Voltará para: <strong>{o.etapaAnterior}</strong> · {fmtR(o.valor)}
                 </div>
               </div>
               <div style={{textAlign:"right",flexShrink:0}}>
                 <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase"}}>Em espera</div>
                 <div style={{...F.body,fontSize:18,fontWeight:800,color:C.blue,lineHeight:1}}>{fmtH(o.horasAtual)}</div>
               </div>
             </div>
             <div style={{background:C.blue+"12",borderLeft:`3px solid ${C.blue}`,borderRadius:4,padding:"8px 10px",marginBottom:8,...F.body,fontSize:12,color:"#1e40af",fontWeight:600,lineHeight:1.4}}>
               <div><strong>🔗 Aguardando pedido:</strong> {o.pedidoDependencia||"—"}</div>
               <div style={{marginTop:4,whiteSpace:"pre-wrap",wordBreak:"break-word"}}><strong>📝 Motivo:</strong> {o.motivo||"—"}</div>
             </div>
             <div style={{...F.body,fontSize:11,color:C.gray500,marginBottom:10}}>Entrou em: {o.entrouEm ? new Date(o.entrouEm).toLocaleString("pt-BR") : "—"}</div>
             {selected?.id===o.id ? (
               <div style={{background:C.gray50,borderRadius:6,padding:12,display:"flex",flexDirection:"column",gap:8}}>
                 <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase"}}>Motivo do retorno (obrigatório)</label>
                 <textarea value={motivoRetorno} onChange={e=>setMotivoRetorno(e.target.value)} rows={2} placeholder="Ex: o outro pedido foi faturado; material chegou; ..." style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:5,padding:"8px 10px",outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
                 <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                   <button onClick={()=>{setSelected(null);setMotivoRetorno("");}} style={{background:C.white,color:C.gray600,border:`1px solid ${C.gray200}`,borderRadius:5,padding:"7px 12px",...F.body,fontSize:12,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
                   <button onClick={confirmarRetorno} style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"7px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>Confirmar retorno</button>
                 </div>
               </div>
             ) : (
               <button onClick={()=>{setSelected(o);setMotivoRetorno("");}} style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"8px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                 ↩ Marcar como resolvido e voltar
               </button>
             )}
           </div>
         ))}
       </div>}
    </div>
  );
}

function RelatorioPendencias({user}){
  const [dias,setDias]=useState(90);
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [filtroTexto,setFiltroTexto]=useState("");

  const carregar=(d=dias)=>{
    setLoading(true);
    apiFetch(`/relatorio/pendencias?dias=${d}`).then(r=>{
      if(r.success)setData(r);
    }).finally(()=>setLoading(false));
  };
  useEffect(()=>{ carregar(); },[]);

  const fmtH=(h)=>{
    if(!h||h<0.05)return "—";
    if(h<1)return `${Math.round(h*60)}min`;
    if(h<24)return `${h.toFixed(1)}h`;
    return `${Math.floor(h/24)}d ${Math.round(h%24)}h`;
  };
  const fmtDt=(d)=>d?new Date(d).toLocaleString("pt-BR"):"—";

  const exportarCSV=()=>{
    if(!data?.items?.length){alert("Nada pra exportar."); return;}
    const cols=["Deal ID","Vendas ID","Linx","Cliente","Valor","Pipeline","Status","Etapa Origem","Motivo Entrada","Motivo Retorno","Entrou em","Saiu em","Tempo Total (h)"];
    const rows=data.items.map(i=>[i.dealId,i.vendasId,i.pedidoLinx,i.cliente,i.valor,i.pipeline,i.statusAtual,i.etapaOrigem,i.motivoEntrada,i.motivoRetorno,i.entrouEm,i.saiuEm,i.horasTotalPendencia]);
    const csv=[cols,...rows].map(r=>r.map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(";")).join("\n");
    // BOM UTF-8 pra Excel abrir corretamente com acentos
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=`pendencias_comercial_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filtrado=(data?.items||[]).filter(i=>{
    if(!filtroTexto.trim())return true;
    const q=filtroTexto.toLowerCase();
    return (i.cliente||"").toLowerCase().includes(q)
      || String(i.vendasId||"").includes(q)
      || String(i.pedidoLinx||"").includes(q)
      || (i.motivoEntrada||"").toLowerCase().includes(q)
      || (i.motivoRetorno||"").toLowerCase().includes(q);
  });

  return(
    <div style={{padding:24}}>
      <PageH title="Relatório de Pendências Comerciais" sub="Métricas gerenciais de retrabalho comercial. Cada hora aqui pesa contra o SLA do pedido."/>

      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
        <label style={{...F.body,fontSize:12,fontWeight:700,color:C.gray600}}>Período:</label>
        {[7,30,90,180,365].map(d=>(
          <button key={d} onClick={()=>{setDias(d);carregar(d);}}
            style={{padding:"6px 12px",borderRadius:6,border:`1.5px solid ${dias===d?C.red:C.gray200}`,background:dias===d?C.red+"10":C.white,color:dias===d?C.red:C.gray600,cursor:"pointer",...F.body,fontSize:12,fontWeight:dias===d?700:500}}>
            {d===7?"7 dias":d===30?"30 dias":d===90?"90 dias":d===180?"6 meses":"1 ano"}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <input value={filtroTexto} onChange={e=>setFiltroTexto(e.target.value)} placeholder="Buscar cliente, pedido, motivo..."
            style={{...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"7px 10px",width:240,outline:"none"}}/>
          <button onClick={exportarCSV} style={{background:C.green,color:C.white,border:"none",borderRadius:6,padding:"7px 14px",cursor:"pointer",...F.body,fontSize:12,fontWeight:700,display:"inline-flex",alignItems:"center",gap:6}}>
            <Ic n="download" s={13} c={C.white}/> Exportar CSV
          </button>
        </div>
      </div>

      {loading?<div style={{padding:40,textAlign:"center",...F.body,color:C.gray400}}>Carregando...</div>
       :!data?<Vazio/>
       :<>
         {/* KPIs */}
         <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:12,marginBottom:16}}>
           {[
             {lbl:"Pedidos com pendência",val:data.resumo.totalPedidos,cor:C.gray700},
             {lbl:"Em andamento (aberto)",val:data.resumo.emAndamento,cor:C.amber},
             {lbl:"Resolvidas (histórico)",val:data.resumo.resolvidas,cor:C.green},
             {lbl:"Horas totais retrabalho",val:fmtH(data.resumo.somaHoras),cor:C.red},
             {lbl:"Média por pedido",val:fmtH(data.resumo.mediaHorasPorPedido),cor:C.blue},
           ].map((k,i)=>(
             <div key={i} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 14px"}}>
               <div style={{...F.body,fontSize:10.5,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{k.lbl}</div>
               <div style={{...F.title,fontSize:22,fontWeight:800,color:k.cor,marginTop:4,lineHeight:1}}>{k.val}</div>
             </div>
           ))}
         </div>

         {/* Distribuição por etapa */}
         {data.porEtapa&&data.porEtapa.length>0&&<Card>
           <div style={{...F.title,fontSize:14,fontWeight:700,color:C.gray700,marginBottom:10}}>Distribuição por etapa de origem</div>
           {data.porEtapa.map((p,i)=>{
             const mx=Math.max(...data.porEtapa.map(x=>x.qtd));
             const pct=mx>0?(p.qtd/mx*100):0;
             return(
               <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0"}}>
                 <span style={{...F.body,fontSize:12,fontWeight:600,color:C.gray700,minWidth:180}}>{p.etapa}</span>
                 <div style={{flex:1,height:8,background:C.gray100,borderRadius:4,overflow:"hidden"}}>
                   <div style={{width:pct+"%",height:"100%",background:C.amber}}/>
                 </div>
                 <span style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,minWidth:80,textAlign:"right"}}>{p.qtd} ped · {fmtH(p.horas)}</span>
               </div>
             );
           })}
         </Card>}

         {/* Tabela de pedidos */}
         <div style={{marginTop:16,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden"}}>
           <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.gray200}`,...F.title,fontSize:13,fontWeight:700,color:C.gray700}}>
             Pedidos ({filtrado.length})
           </div>
           {filtrado.length===0?<div style={{padding:24,textAlign:"center",...F.body,color:C.gray400}}>Nenhum pedido encontrado.</div>
            :<div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:C.gray50,borderBottom:`2px solid ${C.gray200}`}}>
                    {["Pedido","Cliente","Origem","Status","Motivo entrada","Motivo retorno","Tempo total","Data"].map((h,i)=>(
                      <th key={i} style={{...F.body,padding:"8px 10px",textAlign:"left",fontSize:10.5,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrado.map((i,idx)=>(
                    <tr key={idx} style={{borderBottom:`1px solid ${C.gray100}`}}>
                      <td style={{...F.body,padding:"8px 10px",verticalAlign:"top"}}>
                        <div style={{fontWeight:700,color:C.black}}>{i.pedidoLinx?`Linx ${i.pedidoLinx}`:i.vendasId}</div>
                        <div style={{fontSize:10.5,color:C.gray400}}>{i.vendasId}</div>
                      </td>
                      <td style={{...F.body,padding:"8px 10px",color:C.gray700,verticalAlign:"top",maxWidth:180}}>{i.cliente}</td>
                      <td style={{...F.body,padding:"8px 10px",color:C.gray600,verticalAlign:"top",fontSize:11}}>{i.etapaOrigem}</td>
                      <td style={{...F.body,padding:"8px 10px",verticalAlign:"top"}}>
                        <span style={{...F.title,fontSize:9.5,fontWeight:800,padding:"2px 7px",borderRadius:4,letterSpacing:"0.04em",
                          background:i.statusAtual==="EM PENDÊNCIA"?C.amber+"22":C.green+"22",
                          color:i.statusAtual==="EM PENDÊNCIA"?"#92400e":"#166534",
                          border:`1px solid ${i.statusAtual==="EM PENDÊNCIA"?C.amber:C.green}55`}}>
                          {i.statusAtual}
                        </span>
                      </td>
                      <td style={{...F.body,padding:"8px 10px",color:C.gray700,verticalAlign:"top",fontSize:11,maxWidth:220,wordBreak:"break-word"}}>{i.motivoEntrada||"—"}</td>
                      <td style={{...F.body,padding:"8px 10px",color:C.gray700,verticalAlign:"top",fontSize:11,maxWidth:220,wordBreak:"break-word"}}>{i.motivoRetorno||"—"}</td>
                      <td style={{...F.body,padding:"8px 10px",verticalAlign:"top",fontWeight:700,color:i.horasTotalPendencia>=24?C.red:i.horasTotalPendencia>=4?C.amber:C.gray700,whiteSpace:"nowrap"}}>{fmtH(i.horasTotalPendencia)}</td>
                      <td style={{...F.body,padding:"8px 10px",verticalAlign:"top",color:C.gray500,fontSize:10.5,whiteSpace:"nowrap"}}>{fmtDt(i.entrouEm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
         </div>
       </>}
    </div>
  );
}

function PendenciaComercial({user}){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState(null);
  const [motivoRetorno,setMotivoRetorno]=useState("");
  const [msg,setMsg]=useState("");

  const carregar=()=>{
    setLoading(true);
    apiFetch("/pendencia-comercial").then(r=>{
      if(r.success)setItems(r.items||[]);
    }).finally(()=>setLoading(false));
  };
  useEffect(()=>{ carregar(); },[]);

  const fmtH=(h)=>{
    if(h<1)return `${Math.round(h*60)}min`;
    if(h<24)return `${h.toFixed(1)}h`;
    return `${Math.floor(h/24)}d ${Math.round(h%24)}h`;
  };

  const confirmarRetorno=async()=>{
    if(!selected)return;
    if(!motivoRetorno.trim()){alert("Motivo do retorno é obrigatório."); return;}
    try{
      const r=await apiFetch("/pendencia-comercial/sair","POST",{
        dealId: selected.posvendaId || selected.bordadoId,
        motivo: motivoRetorno.trim(),
        ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if(r.success){
        setMsg(`Retornado. Ficou ${(r.horasNessaPendencia||0).toFixed(1)}h em pendência.`);
        setSelected(null); setMotivoRetorno("");
        carregar();
        setTimeout(()=>setMsg(""),4000);
      } else alert("Erro: "+(r.error||"desconhecido"));
    }catch(e){alert("Erro: "+e.message);}
  };

  return(
    <div style={{padding:24}}>
      <PageH title="Pendência Comercial" sub="Pedidos aguardando ação do vendedor. Tempo aqui conta como retrabalho comercial."/>
      {msg&&<div style={{background:C.green+"12",border:`1px solid ${C.green}30`,color:C.green,padding:"10px 14px",borderRadius:6,marginBottom:14,...F.body,fontSize:13,fontWeight:700}}>✓ {msg}</div>}
      {loading?<div style={{padding:40,textAlign:"center",...F.body,color:C.gray400}}>Carregando...</div>
       :items.length===0?<Card><div style={{padding:40,textAlign:"center",...F.body,color:C.gray500}}>Nenhum pedido em pendência comercial no momento.</div></Card>
       :<div style={{display:"flex",flexDirection:"column",gap:10}}>
         {items.map(o=>(
           <div key={o.id} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:14,borderLeft:`4px solid ${C.amber}`}}>
             <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8,flexWrap:"wrap"}}>
               <div style={{minWidth:0,flex:1}}>
                 <div style={{...F.body,fontSize:14,fontWeight:700,color:C.black}}>PED - {o.vendasId}</div>
                 <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:2}}>{o.client}</div>
                 <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:4}}>
                   Voltará para: <strong>{o.etapaAnterior}</strong> · {fmtR(o.valor)}
                 </div>
               </div>
               <div style={{textAlign:"right",flexShrink:0}}>
                 <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase"}}>Nesta pendência</div>
                 <div style={{...F.body,fontSize:18,fontWeight:800,color:C.amber,lineHeight:1}}>{fmtH(o.horasAtual)}</div>
                 {o.horasAcumulado>o.horasAtual&&<div style={{...F.body,fontSize:10,color:C.gray500,marginTop:2}}>Total acum: {fmtH(o.horasAcumulado)}</div>}
               </div>
             </div>
             <div style={{background:C.amber+"12",borderLeft:`3px solid ${C.amber}`,borderRadius:4,padding:"8px 10px",marginBottom:10,...F.body,fontSize:12,color:"#78350f",fontWeight:600,lineHeight:1.4,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
               <strong>📝 Motivo:</strong> {o.motivo || "—"}
             </div>
             <div style={{...F.body,fontSize:11,color:C.gray500,marginBottom:10}}>Entrou em: {o.entrouEm ? new Date(o.entrouEm).toLocaleString("pt-BR") : "—"}</div>
             {selected?.id===o.id ? (
               <div style={{background:C.gray50,borderRadius:6,padding:12,display:"flex",flexDirection:"column",gap:8}}>
                 <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase"}}>Motivo do retorno (obrigatório)</label>
                 <textarea value={motivoRetorno} onChange={e=>setMotivoRetorno(e.target.value)} rows={2} placeholder="Ex: vendedor confirmou que a peça está no cadastro; cliente aprovou alteração..." style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:5,padding:"8px 10px",outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
                 <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                   <button onClick={()=>{setSelected(null);setMotivoRetorno("");}} style={{background:C.white,color:C.gray600,border:`1px solid ${C.gray200}`,borderRadius:5,padding:"7px 12px",...F.body,fontSize:12,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
                   <button onClick={confirmarRetorno} style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"7px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>Confirmar retorno</button>
                 </div>
               </div>
             ) : (
               <button onClick={()=>{setSelected(o);setMotivoRetorno("");}} style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"8px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                 ↩ Marcar como resolvido e voltar
               </button>
             )}
           </div>
         ))}
       </div>}
    </div>
  );
}

function ImpressaoPedido({user}){
  const [modo,setModo]=useState("data");
  const hoje=new Date().toISOString().slice(0,10);
  const [de,setDe]=useState(hoje),[ate,setAte]=useState(hoje);
  const [pedido,setPedido]=useState("");
  const [cliente,setCliente]=useState("");
  const [resp,setResp]=useState(null);
  const [loading,setLoading]=useState(false);
  const [erro,setErro]=useState("");
  // Se o usuário clicou em "Imprimir Pedido" num card, o vendasId veio via
  // sessionStorage. Pega, muda pra modo "pedido" e dispara busca automática.
  useEffect(()=>{
    try {
      const auto = sessionStorage.getItem("sgp_imprimir_pedido");
      if (auto) {
        sessionStorage.removeItem("sgp_imprimir_pedido");
        setModo("pedido");
        setPedido(auto);
        // Busca imediata sem esperar clique
        setLoading(true);setErro("");
        apiFetch(`/impressao?pedido=${encodeURIComponent(auto)}`).then(r=>{
          if(r.success)setResp(r); else setErro(r.error||"Erro ao buscar.");
        }).catch(e=>setErro(e.message)).finally(()=>setLoading(false));
      }
    } catch(e){}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const buscar=()=>{
    setLoading(true);setErro("");setResp(null);
    let qs;
    if(modo==="pedido"){
      // Aceita ID do HubSpot OU código do Linx — o worker resolve
      qs = `?pedido=${encodeURIComponent(pedido.trim())}`;
    } else if(modo==="cliente"){
      qs = `?cliente=${encodeURIComponent(cliente.trim())}`;
    } else {
      qs = `?de=${de}&ate=${ate}`;
    }
    apiFetch("/impressao"+qs).then(r=>{ if(r.success)setResp(r); else setErro(r.error||"Erro ao buscar."); }).catch(e=>setErro(e.message)).finally(()=>setLoading(false));
  };

  const emit=resp?.emitente||{};
  const orders=resp?.data||[];
  const fmtDt=(d)=>d?new Date(d).toLocaleDateString("pt-BR"):"";
  const inp={border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"9px 12px",...F.body,fontSize:13,outline:"none"};
  const lbl={...F.body,fontSize:11,fontWeight:700,color:C.gray500,display:"block",marginBottom:4};

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <div className="no-print"><PageH title="Impressão de Pedido" sub="Folha de separação — uma página por pedido, com foto dos produtos"/></div>

      <div className="no-print"><Card>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {[["data","Por intervalo de datas"],["pedido","Por nº do pedido (HubSpot ou Linx)"],["cliente","Por nome do cliente"]].map(([id,l])=>(
            <button key={id} onClick={()=>setModo(id)} style={{padding:"7px 14px",borderRadius:7,border:`1.5px solid ${modo===id?C.red:C.gray200}`,background:modo===id?C.red+"10":C.white,color:modo===id?C.red:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:modo===id?700:500}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
          {modo==="data"&&<>
            <div><label style={lbl}>De</label><input type="date" value={de} onChange={e=>setDe(e.target.value)} style={inp}/></div>
            <div><label style={lbl}>Até</label><input type="date" value={ate} onChange={e=>setAte(e.target.value)} style={inp}/></div>
          </>}
          {modo==="pedido"&&(
            <div style={{flex:1,minWidth:220}}><label style={lbl}>ID do HubSpot ou nº Linx</label>
              <input value={pedido} onChange={e=>setPedido(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")buscar();}} placeholder="ex.: 61293153208 ou 218436" style={{...inp,width:"100%",boxSizing:"border-box"}}/>
            </div>
          )}
          {modo==="cliente"&&(
            <div style={{flex:1,minWidth:220}}><label style={lbl}>Nome do cliente (busca parcial)</label>
              <input value={cliente} onChange={e=>setCliente(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")buscar();}} placeholder="ex.: NW CONTABILIDADE" style={{...inp,width:"100%",boxSizing:"border-box"}}/>
            </div>
          )}
          <button onClick={buscar} disabled={loading||(modo==="pedido"&&!pedido.trim())||(modo==="cliente"&&!cliente.trim())} style={{background:C.red,color:C.white,border:"none",borderRadius:7,padding:"10px 18px",cursor:loading?"wait":"pointer",fontWeight:700,fontSize:13,...F.body,opacity:(modo==="pedido"&&!pedido.trim())||(modo==="cliente"&&!cliente.trim())?0.5:1}}>{loading?"Buscando...":"Buscar"}</button>
          {orders.length>0&&<button onClick={()=>window.print()} style={{background:C.green,color:C.white,border:"none",borderRadius:7,padding:"10px 18px",cursor:"pointer",fontWeight:700,fontSize:13,...F.body,display:"inline-flex",alignItems:"center",gap:7}}>
            <Ic n="print" s={15} c={C.white}/> Imprimir / PDF ({orders.length} pedido{orders.length!==1?"s":""})
          </button>}
        </div>
        {erro&&<div style={{marginTop:12,...F.body,fontSize:13,color:C.red,display:"flex",alignItems:"center",gap:6}}><Ic n="warn" s={14} c={C.red}/>{erro}</div>}
        {resp&&orders.length===0&&<div style={{marginTop:12,...F.body,fontSize:13,color:C.gray500}}>Nenhum pedido encontrado para o filtro.</div>}
        {resp&&orders.length>0&&!emit.razaoSocial&&<div style={{marginTop:12,padding:"9px 12px",background:C.amber+"12",border:`1px solid ${C.amber}40`,borderRadius:7,...F.body,fontSize:12,color:"#8a5a00"}}>Dica: configure os dados da Citerol (emitente) em <strong>Configurações</strong> para aparecerem no cabeçalho.</div>}
        {resp&&orders.length>0&&<div style={{marginTop:12,...F.body,fontSize:12,color:C.gray500}}>{orders.length} pedido(s) — uma folha cada (quebra pra 2ª folha só se não couber). Confira a pré-visualização e clique em Imprimir.</div>}
      </Card></div>

      {orders.length>0&&<div className="print-area" style={{display:"flex",flexDirection:"column",gap:18,alignItems:"center"}}>
        {orders.map((o,i)=><Folha key={i} emit={emit} o={o} fmtDt={fmtDt}/>)}
      </div>}

      <style>{`@media print {
        body * { visibility: hidden !important; }
        .print-area, .print-area * { visibility: visible !important; }
        .print-area { position: absolute; left: 0; top: 0; width: 100%; gap: 0 !important; }
        .no-print { display: none !important; }
        .folha-print { box-shadow: none !important; border: none !important; border-radius: 0 !important; max-width: 100% !important; page-break-after: always; }
        .produto-row { page-break-inside: avoid; }
      }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULOS DE ANÁLISE (Painel de Fluxo · Gestão à Vista · Pedidos em Risco)
// Aditivos. Consomem os endpoints /painel-fluxo, /gestao-vista, /pedidos-risco.
// ═══════════════════════════════════════════════════════════════════════════
const _f1 = n => (n==null||isNaN(n)) ? "—" : (Math.round(n*10)/10).toString().replace(".",",");
const _iso = d => d.toISOString().slice(0,10);

// "?" com explicação (O que é / Como se calcula)
function Ajuda({oq,como}){
  const [open,setOpen]=useState(false);
  return (
    <span style={{position:"relative",display:"inline-flex",verticalAlign:"middle"}}>
      <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
        onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}
        style={{width:16,height:16,borderRadius:"50%",border:`1.4px solid ${C.gray400}`,background:"transparent",
          color:C.gray500,fontSize:10,fontWeight:700,lineHeight:1,cursor:"pointer",display:"inline-flex",
          alignItems:"center",justifyContent:"center",padding:0,flex:"0 0 auto"}}>?</button>
      {open&&<span style={{position:"absolute",top:22,left:"50%",transform:"translateX(-50%)",width:230,
        background:C.white,border:`1px solid ${C.gray200}`,borderRadius:10,boxShadow:"0 10px 30px rgba(0,0,0,.16)",
        padding:"10px 11px",zIndex:50,fontSize:12,lineHeight:1.5,color:C.gray700,textAlign:"left",fontWeight:400,
        textTransform:"none",letterSpacing:0,...F.body}}>
        <div style={{marginBottom:5}}><b style={{color:C.black}}>O que é:</b> {oq}</div>
        <div><b style={{color:C.black}}>Como se calcula:</b> {como}</div>
      </span>}
    </span>
  );
}
function CabecalhoAnalise({titulo,sub,corBarra}){
  return (
    <div style={{padding:"4px 2px 14px"}}>
      <div style={{...F.title,fontSize:11,letterSpacing:"0.14em",color:C.gray500,fontWeight:600}}>SGP · CITEROL</div>
      <h1 style={{...F.title,fontSize:25,fontWeight:700,margin:"3px 0 0"}}>{titulo}</h1>
      <div style={{width:42,height:4,background:corBarra||C.red,borderRadius:3,marginTop:8}}/>
      {sub&&<div style={{...F.body,fontSize:12,color:C.gray600,marginTop:8,maxWidth:640}}>{sub}</div>}
    </div>
  );
}
function EstadoCarga({loading,erro,onRetry,vazio,vazioTxt}){
  if(loading) return <div style={{...F.body,textAlign:"center",color:C.gray500,padding:"60px 0"}}>Carregando…</div>;
  if(erro) return <div style={{...F.body,textAlign:"center",color:C.red,padding:"50px 0"}}>
    Não foi possível carregar. <button onClick={onRetry} style={{marginLeft:8,...F.body,color:C.red,textDecoration:"underline",background:"none",border:"none",cursor:"pointer"}}>tentar de novo</button></div>;
  if(vazio) return <div style={{...F.body,textAlign:"center",color:C.gray500,padding:"50px 0"}}>{vazioTxt||"Nada por aqui."}</div>;
  return null;
}
const cardBox = {background:C.white,border:`1px solid ${C.gray200}`,borderRadius:15,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"};

// ─── PAINEL DE FLUXO ─────────────────────────────────────────────────────────
function PainelFluxo(){
  const isMobile=useIsMobile();
  const hoje=new Date(); hoje.setHours(0,0,0,0);
  const [de,setDe]=useState(_iso(new Date(hoje.getFullYear(),hoje.getMonth(),1)));
  const [ate,setAte]=useState(_iso(hoje));
  const [d,setD]=useState(null);
  const [loading,setLoading]=useState(true);
  const [erro,setErro]=useState(false);
  const [relSel,setRelSel]=useState("");
  const [cfdHover,setCfdHover]=useState(null);
  const carregar=()=>{setLoading(true);setErro(false);
    apiFetch(`/painel-fluxo?de=${de}&ate=${ate}`).then(r=>{setD(r);setLoading(false);
      if(r.pedidos&&r.pedidos.length&&!relSel)setRelSel(String(r.pedidos[0].id));
    }).catch(()=>{setErro(true);setLoading(false);});};
  useEffect(carregar,[de,ate]);

  return (
    <div style={{padding:isMobile?14:"18px 22px",maxWidth:1180,margin:"0 auto"}}>
      <CabecalhoAnalise titulo="Painel de Fluxo" sub="Indicadores do fluxo de produção. Toque no ? em cada medida pra ver o que é e como é calculada."/>
      {/* filtro */}
      <div style={{...cardBox,display:"flex",alignItems:"flex-end",gap:10,flexWrap:"wrap",marginBottom:14}}>
        <div><label style={lblFiltro}>De</label><input type="date" value={de} onChange={e=>setDe(e.target.value)} style={inpFiltro}/></div>
        <div><label style={lblFiltro}>Até</label><input type="date" value={ate} onChange={e=>setAte(e.target.value)} style={inpFiltro}/></div>
        {d&&<div style={{marginLeft:"auto",...F.body,fontSize:11.5,color:C.gray600,fontWeight:600,textAlign:"right"}}>
          Período analisado:<br/><b style={{color:C.black}}>{brData(d.periodo.de)}</b> a <b style={{color:C.black}}>{brData(d.periodo.ate)}</b> · <b style={{color:C.black}}>{d.periodo.n}</b> faturados</div>}
      </div>
      <EstadoCarga loading={loading} erro={erro} onRetry={carregar}/>
      {d&&!loading&&!erro&&<>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:14}}>
          <Kpi lab="Lead Time" val={_f1(d.leadMedio)} un=" dias" sub="tempo de atravessamento médio" subCor={C.green}
            oq="Tempo total do pedido, do início (orçamento aprovado) ao faturamento." como="Média, no período, de (faturamento − criação) dos pedidos faturados."/>
          <Kpi lab="OTIF" val={d.otif} un="%" sub="no prazo e completo · meta 90%"
            oq="Percentual de pedidos entregues no prazo E completos." como="(faturados até o vencimento E completos) ÷ total faturado no período."/>
          <Kpi lab="Vazão" val={d.vazao} un=" ped." sub="faturados nos últimos 7 dias"
            oq="Quantos pedidos ficam prontos por período." como="Contagem de pedidos faturados nos últimos 7 dias."/>
          <Kpi lab="WIP" val={d.wipTotal} un=" ped." sub="em aberto agora"
            oq="Trabalho em progresso: pedidos em andamento." como="Pedidos em qualquer etapa, exceto Faturado."/>
        </div>
        {/* gargalo */}
        <div style={{...cardBox,background:"linear-gradient(180deg,#fff,#fdf4f4)",borderColor:"#9E0B0F33",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{...F.title,display:"inline-flex",alignItems:"center",gap:6,background:C.red,color:"#fff",
              fontSize:11,fontWeight:600,padding:"5px 11px",borderRadius:20,letterSpacing:"0.07em"}}>● GARGALO</span>
            <Ajuda oq="A etapa que mais represa o fluxo." como="Etapa com maior combinação de WIP e envelhecimento da fila."/>
          </div>
          <div style={{...F.title,fontSize:23,fontWeight:700,marginTop:10}}>{d.gargalo.nm}</div>
          <div style={{display:"flex",gap:20,marginTop:6}}>
            <div><b style={{...F.title,fontSize:19,color:C.red}}>{d.gargalo.n}</b><span style={{display:"block",...F.body,fontSize:11,color:C.gray600}}>na fila</span></div>
            <div><b style={{...F.title,fontSize:19,color:C.red}}>{d.gargalo.age} d</b><span style={{display:"block",...F.body,fontSize:11,color:C.gray600}}>mais antigo</span></div>
          </div>
        </div>
        {/* cycle + wip */}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
          <div style={cardBox}>
            <TituloCard texto="Tempo por etapa (Cycle Time)" oq="Quanto tempo o pedido fica em média em cada etapa." como="Média de (saída − entrada) por etapa, pelos marcos de cada estágio."/>
            <div style={{...F.body,fontSize:11.5,color:C.gray500,margin:"2px 0 12px"}}>Dias médios em cada etapa.</div>
            {(d.cycleTime||[]).length? d.cycleTime.map((c,i)=>{
              const mx=Math.max(...d.cycleTime.map(x=>x.dias),0.1);const peak=c.dias===mx;
              return <BarLinha key={i} nm={c.nm} pct={c.dias/mx*100} txt={_f1(c.dias)+"d"} cor={peak?C.red:C.gray400}/>;
            }):<Vazio/>}
          </div>
          <div style={cardBox}>
            <TituloCard texto="WIP por etapa" oq="O WIP separado por etapa, com o envelhecimento do mais antigo." como="Conta os pedidos em cada etapa; envelhecimento = dias desde a entrada do mais antigo." extra={d.wipTotal+" em aberto"}/>
            {(d.wipPorEtapa||[]).length? d.wipPorEtapa.map((w,i)=>{
              const st=w.age>=5?"bad":w.age>=3?"warn":"ok";
              const cor=st==="bad"?C.red:st==="warn"?C.amber:C.green;
              const bg=st==="bad"?"#9E0B0F14":st==="warn"?"#b4530914":"#4B552814";
              return <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.gray100}`}}>
                <span style={{...F.body,fontSize:12.5,fontWeight:600,color:C.gray700}}>{w.nm}</span>
                <span style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{...F.body,fontSize:10.5,fontWeight:700,padding:"3px 8px",borderRadius:20,background:bg,color:cor}}>{w.age} d</span>
                  <span style={{...F.title,fontSize:18,fontWeight:700,minWidth:26,textAlign:"right"}}>{w.n}</span>
                </span></div>;
            }):<Vazio/>}
          </div>
        </div>
        {/* otif + relatório */}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
          <div style={cardBox}>
            <TituloCard texto="No prazo e completo (OTIF)" oq="Percentual de pedidos no prazo E completos." como="No prazo+completo vs atrasado vs incompleto, sobre os faturados do período." extra={d.periodo.n+" faturados"}/>
            <div style={{display:"flex",alignItems:"center",gap:18,marginTop:6}}>
              <DonutOTIF prazo={d.otifBreak.prazo} atraso={d.otifBreak.atraso} incompleto={d.otifBreak.incompleto}/>
              <div style={{flex:1}}>
                <LegOtif cor={C.green} txt="No prazo e completo" val={d.otifBreak.prazo}/>
                <LegOtif cor={C.red} txt="Atrasado" val={d.otifBreak.atraso}/>
                <LegOtif cor={C.amber} txt="Incompleto" val={d.otifBreak.incompleto}/>
              </div>
            </div>
          </div>
          <div style={cardBox}>
            <TituloCard texto="Relatório por etapa" oq="Tempo que um pedido passou em cada etapa." como="Diferença entre os marcos de entrada de cada estágio registrados no HubSpot."/>
            <div style={{...F.body,fontSize:11.5,color:C.gray500,margin:"2px 0 8px"}}>Escolha um pedido e veja o tempo em cada etapa.</div>
            <select value={relSel} onChange={e=>setRelSel(e.target.value)} style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 10px",...F.body,fontSize:13,marginBottom:8}}>
              {(d.pedidos||[]).map(p=><option key={p.id} value={String(p.id)}>Pedido {p.id} · {p.cli}{p.finalizado?" (faturado)":""}</option>)}
            </select>
            <RelatorioEtapa pedido={(d.pedidos||[]).find(p=>String(p.id)===String(relSel))}/>
          </div>
        </div>
        {/* CFD */}
        <div style={cardBox}>
          <TituloCard texto="Fluxo acumulado (CFD)" oq="Acúmulo de pedidos por etapa ao longo do tempo. Faixa que engorda = gargalo." como="A cada dia conta quantos passaram por cada marco; a área entre marcos é a fila da etapa." extra="últimos 14 dias"/>
          <div style={{...F.body,fontSize:11.5,color:C.gray500,margin:"2px 0 12px"}}>Cada faixa é uma fase; faixa engrossando = gargalo.</div>
          <GraficoCFD cfd={d.cfd} hover={cfdHover} setHover={setCfdHover}/>
        </div>
      </>}
    </div>
  );
}
function Kpi({lab,val,un,sub,subCor,oq,como}){
  return <div style={cardBox}>
    <div style={{...F.body,fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:C.gray500,display:"flex",alignItems:"center",gap:6,minHeight:18}}>
      <span style={{flex:1}}>{lab}</span><Ajuda oq={oq} como={como}/></div>
    <div style={{...F.title,fontSize:30,fontWeight:700,lineHeight:1.05,marginTop:5}}>{val}<span style={{fontSize:14,fontWeight:500,color:C.gray500}}>{un}</span></div>
    <div style={{...F.body,fontSize:11,fontWeight:600,marginTop:3,color:subCor||C.gray500}}>{sub}</div>
  </div>;
}
function TituloCard({texto,oq,como,extra,tv}){
  // tv=true: painel de parede. Fonte maior e sem cinza claro no texto auxiliar.
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:tv?10:5}}>
    <span style={{...F.title,fontSize:tv?"clamp(17px,1.6vw,26px)":14,fontWeight:tv?800:600,color:C.black}}>{texto}</span>
    {oq&&<Ajuda oq={oq} como={como}/>}
    {extra&&<span style={{marginLeft:"auto",...F.body,fontSize:tv?"clamp(14px,1.2vw,20px)":11,color:tv?C.red:C.gray500,fontWeight:tv?800:600}}>{extra}</span>}
  </div>;
}
function BarLinha({nm,pct,txt,cor}){
  return <div style={{display:"flex",alignItems:"center",gap:9,margin:"8px 0"}}>
    <span style={{flex:"0 0 100px",...F.body,fontSize:12,fontWeight:600,color:C.gray700}}>{nm}</span>
    <span style={{flex:1,height:18,background:C.gray100,borderRadius:5,overflow:"hidden"}}>
      <span style={{display:"block",height:"100%",width:Math.max(2,pct)+"%",background:cor}}/></span>
    <span style={{flex:"0 0 56px",textAlign:"right",...F.title,fontWeight:600,fontSize:12.5,color:cor===C.red?C.red:C.gray700}}>{txt}</span>
  </div>;
}
function Vazio(){return <div style={{...F.body,fontSize:12,color:C.gray400,padding:"14px 0"}}>Ainda sem dados suficientes neste período.</div>;}
function LegOtif({cor,txt,val}){
  return <div style={{display:"flex",alignItems:"center",gap:8,margin:"7px 0",...F.body,fontSize:12,color:C.gray700}}>
    <span style={{width:10,height:10,borderRadius:3,background:cor,flex:"0 0 auto"}}/>{txt}
    <b style={{...F.title,marginLeft:"auto",fontSize:15}}>{val}%</b></div>;
}
function DonutOTIF({prazo,atraso,incompleto}){
  const cx=60,cy=60,r=46,circ=2*Math.PI*r;let off=0;
  const segs=[[prazo,C.green],[atraso,C.red],[incompleto,C.amber]];
  return <svg width="120" height="120" viewBox="0 0 120 120" style={{flex:"0 0 120px"}}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.gray100} strokeWidth="15"/>
    {segs.map(([p,col],i)=>{const len=p/100*circ;const el=<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="15" strokeDasharray={`${len} ${circ-len}`} strokeDashoffset={-off} transform={`rotate(-90 ${cx} ${cy})`}/>;off+=len;return el;})}
    <text x={cx} y={cy-1} textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="26" fill={C.green}>{prazo}%</text>
    <text x={cx} y={cy+15} textAnchor="middle" fontSize="9" fill={C.gray500}>no prazo</text>
  </svg>;
}
function RelatorioEtapa({pedido}){
  if(!pedido) return <Vazio/>;
  const PAL=[C.gray400,"#6b7280",C.amber,"#8a6d3b","#b8651a",C.red,C.green,"#0e7490"];
  const ets=pedido.etapas||[];
  const lt=ets.reduce((s,e)=>s+(e.dias||0),0);
  const maxd=Math.max(...ets.filter(e=>e.dias!=null).map(e=>e.dias),0);
  return <div>
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:8,flexWrap:"wrap",margin:"6px 0 4px"}}>
      <div><div style={{...F.title,fontSize:18,fontWeight:700}}>Pedido {pedido.id}</div>
        <div style={{...F.body,fontSize:12,color:C.gray600}}>{pedido.cli} · {pedido.comBordado?"com bordado":"sem bordado"} · {pedido.finalizado?"faturado":"em "+(pedido.etapa||"andamento")}</div></div>
      <div style={{textAlign:"right"}}><div style={{...F.body,fontSize:12,color:C.gray600}}>{pedido.finalizado?"lead time":"em aberto há"}</div>
        <div style={{...F.title,fontSize:14,fontWeight:700,color:C.red}}>{_f1(lt)} dias</div></div>
    </div>
    {ets.length?<>
      <div style={{display:"flex",height:14,borderRadius:5,overflow:"hidden",margin:"10px 0 12px",border:`1px solid ${C.gray100}`}}>
        {ets.map((e,i)=><span key={i} title={e.nm} style={{height:"100%",width:Math.max(2,((e.dias||0.3)/(lt||1))*100)+"%",background:e.done?PAL[i%PAL.length]:C.gray200}}/>)}
      </div>
      {ets.map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:9,margin:"7px 0"}}>
        <span style={{width:11,height:11,borderRadius:3,background:e.done?PAL[i%PAL.length]:C.gray200,flex:"0 0 auto"}}/>
        <span style={{flex:1,...F.body,fontSize:12.5,fontWeight:600,color:e.dias===maxd&&e.done?C.red:C.gray700}}>{e.nm}</span>
        <span style={{...F.body,fontSize:10,color:C.gray400,fontWeight:600}}>{e.done?"":"em curso"}</span>
        <span style={{...F.title,fontSize:13,fontWeight:600,color:e.dias===maxd&&e.done?C.red:C.gray700}}>{e.dias!=null?_f1(e.dias)+" d":"—"}</span>
      </div>)}
    </>:<Vazio/>}
  </div>;
}
function GraficoCFD({cfd,hover,setHover}){
  if(!cfd||!cfd.bands||!cfd.dias||!cfd.dias.length) return <Vazio/>;
  const dias=cfd.dias,N=dias.length;
  const W=340,H=210,padL=28,padR=8,padT=10,padB=22,plotW=W-padL-padR,plotH=H-padT-padB;
  const topo=cfd.criado||(cfd.bands[cfd.bands.length-1]?cfd.bands[cfd.bands.length-1].topo:[]);
  const maxY=Math.max(1,...(topo||[1]))*1.05;
  const x=i=>padL+i/Math.max(1,N-1)*plotW, y=v=>padT+plotH-v/maxY*plotH;
  const COR={"Expedição":C.teal,"Bordado":C.red,"Direcionamento":C.blue,"Separação":C.amber,"Início":C.gray400};
  const polys=[];
  // faixa de faturado (0..fat) no fundo
  const fat=cfd.fat||[];
  if(fat.length){let t="",b="";for(let i=0;i<N;i++)t+=`${x(i)},${y(fat[i])} `;for(let i=N-1;i>=0;i--)b+=`${x(i)},${y(0)} `;polys.push(<polygon key="fat" points={t+b} fill={C.gray200} opacity="0.7"/>);}
  cfd.bands.forEach((bd,k)=>{let t="",b="";for(let i=0;i<N;i++)t+=`${x(i)},${y(bd.topo[i])} `;for(let i=N-1;i>=0;i--)b+=`${x(i)},${y(bd.base[i])} `;polys.push(<polygon key={k} points={t+b} fill={COR[bd.nm]||C.gray400} opacity="0.9"/>);});
  const onMove=ev=>{const svg=ev.currentTarget;const rc=svg.getBoundingClientRect();const px=((ev.touches?ev.touches[0].clientX:ev.clientX)-rc.left)*(W/rc.width);let i=Math.round((px-padL)/plotW*(N-1));i=Math.max(0,Math.min(N-1,i));setHover(i);};
  return <div style={{position:"relative"}}>
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block",touchAction:"none"}} onMouseMove={onMove} onMouseLeave={()=>setHover(null)} onTouchStart={onMove} onTouchMove={onMove}>
      {[0,.25,.5,.75,1].map((fr,i)=>{const v=maxY*fr;return <g key={i}><line x1={padL} y1={y(v)} x2={W-padR} y2={y(v)} stroke={C.gray100}/><text x={padL-4} y={y(v)+3} textAnchor="end" fontSize="8" fill={C.gray400} fontFamily="monospace">{Math.round(v)}</text></g>;})}
      {polys}
      {dias.map((dn,i)=>(i%2===0||i===N-1)?<text key={i} x={x(i)} y={H-padB+13} textAnchor="middle" fontSize="8" fill={C.gray500}>{dn}</text>:null)}
      {hover!=null&&<line x1={x(hover)} y1={padT} x2={x(hover)} y2={padT+plotH} stroke={C.gray600} strokeDasharray="3 3"/>}
    </svg>
    <div style={{display:"flex",flexWrap:"wrap",gap:"8px 12px",marginTop:10}}>
      {cfd.bands.slice().reverse().map((b,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:6,...F.body,fontSize:11,color:C.gray600,fontWeight:600}}><span style={{width:10,height:10,borderRadius:3,background:COR[b.nm]||C.gray400}}/>{b.nm}</span>)}
      <span style={{display:"flex",alignItems:"center",gap:6,...F.body,fontSize:11,color:C.gray600,fontWeight:600}}><span style={{width:10,height:10,borderRadius:3,background:C.gray200}}/>Faturado</span>
    </div>
    {hover!=null&&<div style={{...F.body,fontSize:11.5,marginTop:8,padding:"8px 10px",background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8}}>
      <b style={{...F.title}}>Dia {dias[hover]}</b> — {cfd.bands.slice().reverse().map((b,i)=>`${b.nm}: ${(b.topo[hover]-b.base[hover])}`).join(" · ")}</div>}
  </div>;
}

// ─── GESTÃO À VISTA ──────────────────────────────────────────────────────────
function GestaoVista(){
  const isMobile=useIsMobile();
  const [d,setD]=useState(null);const [loading,setLoading]=useState(true);const [erro,setErro]=useState(false);
  const [hora,setHora]=useState("--:--");
  const carregar=()=>{setLoading(true);setErro(false);apiFetch("/gestao-vista").then(r=>{setD(r);setLoading(false);}).catch(()=>{setErro(true);setLoading(false);});};
  useEffect(()=>{carregar();const t=setInterval(carregar,120000);return ()=>clearInterval(t);},[]);
  useEffect(()=>{const tk=()=>{const n=new Date();setHora(String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0"));};tk();const t=setInterval(tk,20000);return ()=>clearInterval(t);},[]);
  const DIAS=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const ag=new Date();
  const tot=d?d.total:0, pAtr=tot?Math.round(d.atrasados/tot*100):0, pPz=100-pAtr;
  const maxTot=d&&d.porEtapa.length?Math.max(...d.porEtapa.map(s=>s.tot),1):1;
  return (
    <div style={{padding:isMobile?14:"22px 26px",maxWidth:1760,margin:"0 auto"}}>
      <div style={{background:C.black,color:"#fff",borderRadius:16,padding:"22px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div><div style={{...F.title,fontSize:"clamp(13px,1.1vw,17px)",letterSpacing:"0.15em",color:"#e0b978",fontWeight:700}}>SGP · CITEROL</div>
          <h2 style={{...F.title,fontSize:"clamp(30px,3.4vw,52px)",margin:"6px 0 0",fontWeight:800}}>GESTÃO À VISTA</h2>
          <div style={{...F.body,fontSize:"clamp(13px,1.1vw,18px)",color:"#ffffff",marginTop:6,fontWeight:600}}>Pedidos em aberto · atualiza sozinho</div></div>
        <div style={{textAlign:"right"}}><div style={{...F.title,fontSize:"clamp(40px,4.6vw,76px)",lineHeight:1,fontWeight:800}}>{hora}</div>
          <div style={{...F.body,fontSize:"clamp(13px,1.1vw,18px)",color:"#ffffff",marginTop:6,fontWeight:600}}>{DIAS[ag.getDay()]}, {ag.getDate()} {MES[ag.getMonth()]}</div></div>
      </div>
      <EstadoCarga loading={loading&&!d} erro={erro&&!d} onRetry={carregar}/>
      {d&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <TileGV cor={C.red} sombra="0 8px 24px #9E0B0F40" lab="Em atraso" num={d.atrasados} pct={pAtr} sub="dos pedidos em aberto"
            oq="Pedidos em aberto cujo vencimento já passou." como="Não finalizados com vencimento anterior a hoje."/>
          <TileGV cor={C.green} lab="No prazo" num={d.noPrazo} pct={pPz} sub="dos pedidos em aberto"
            oq="Pedidos em aberto dentro do prazo." como="Não finalizados com vencimento ≥ hoje."/>
        </div>
        <div style={{...cardBox,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,...F.title,fontSize:"clamp(15px,1.4vw,22px)",fontWeight:700,color:C.black}}>
            <span>SAÚDE DO PRAZO</span><span style={{color:C.black}}>meta: 90% no prazo</span></div>
          <div style={{display:"flex",height:"clamp(56px,6vw,92px)",borderRadius:10,overflow:"hidden",...F.title,fontWeight:800,fontSize:"clamp(26px,3.2vw,54px)",color:"#fff"}}>
            <div style={{background:C.green,width:pPz+"%",display:"flex",alignItems:"center",paddingLeft:18,minWidth:0,whiteSpace:"nowrap"}}>{pPz}%</div>
            <div style={{background:C.red,width:pAtr+"%",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:18,minWidth:0,whiteSpace:"nowrap"}}>{pAtr}%</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:14}}>
          <MiniGV lab="Em aberto" num={d.total} sub="em andamento" oq="Todos os pedidos em andamento." como="Em qualquer etapa, exceto Faturado. Aberto = no prazo + vencidos."/>
          <MiniGV lab="Já vencidos" num={d.atrasados} sub="venceram e abertos" cor={C.red} oq="Pedidos vencidos e ainda abertos." como="Não finalizados com vencimento < hoje."/>
          <MiniGV lab="Vencem hoje" num={d.vencemHoje} sub="prioridade" cor={C.amber} oq="Pedidos em aberto que vencem hoje." como="Não finalizados com vencimento = hoje."/>
          <MiniGV lab="Vencem amanhã" num={d.vencemAmanha} sub="se preparar" oq="Pedidos em aberto que vencem amanhã." como="Não finalizados com vencimento = amanhã."/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14}}>
          <div style={cardBox}>
            <TituloCard texto="Onde estão os atrasados" extra={d.atrasados+" atrasados"} tv/>
            {d.porEtapa.length? d.porEtapa.map((s,i)=>{const lw=s.tot?s.late/s.tot*100:0;return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,margin:"11px 0"}}>
                <span style={{flex:"0 0 190px",...F.body,fontSize:"clamp(14px,1.2vw,20px)",fontWeight:700,color:C.black}}>{s.nm}</span>
                {/* Trilho e barra em tons sólidos: o cinza claro sumia na TV. */}
                <span style={{flex:1,height:"clamp(22px,2vw,32px)",background:C.gray300,borderRadius:5,overflow:"hidden",display:"flex",width:(s.tot/maxTot*100)+"%"}}>
                  <span style={{height:"100%",width:(100-lw)+"%",background:"#7d8a6a"}}/><span style={{height:"100%",width:lw+"%",background:C.red}}/></span>
                <span style={{flex:"0 0 96px",textAlign:"right",...F.title,fontWeight:800,fontSize:"clamp(16px,1.5vw,24px)",color:C.black}}>{s.tot}{s.late?<b style={{color:C.red}}> · {s.late}</b>:null}</span>
              </div>);}):<Vazio/>}
          </div>
          <div style={cardBox}>
            <TituloCard texto="Mais atrasados" extra="resolver primeiro" tv/>
            {d.maisAtrasados.length? d.maisAtrasados.map((o,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.gray200}`}}>
                <span style={{...F.title,fontWeight:700,fontSize:"clamp(15px,1.3vw,21px)",color:C.black}}>{idPedido(o)}</span>
                <span style={{flex:1,minWidth:0}}><span style={{display:"block",...F.body,fontSize:"clamp(15px,1.3vw,21px)",fontWeight:700,color:C.black,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.cli}</span>
                  <span style={{...F.body,fontSize:"clamp(12px,1.05vw,17px)",color:C.black,fontWeight:600}}>{o.et}</span></span>
                <span style={{...F.title,fontWeight:800,fontSize:"clamp(15px,1.4vw,23px)",padding:"6px 14px",borderRadius:20,background:C.red,color:"#fff",whiteSpace:"nowrap"}}>{o.dias} {o.dias===1?"dia":"dias"}</span>
              </div>)):<div style={{...F.body,fontSize:"clamp(14px,1.2vw,19px)",color:C.black,padding:"14px 0",fontWeight:600}}>Nenhum pedido atrasado. 🎉</div>}
          </div>
        </div>
      </>}
    </div>
  );
}
// Painel de TV: tudo precisa ser legível a vários metros de distância.
// Nada de texto com opacidade — de longe, translúcido some.
function TileGV({cor,sombra,lab,num,sub,pct,oq,como}){
  return <div style={{borderRadius:18,padding:"26px 30px",background:cor,color:"#fff",boxShadow:sombra||"none"}}>
    <div style={{...F.title,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:"clamp(20px,2.2vw,34px)",fontWeight:700,display:"flex",alignItems:"center",gap:10,color:"#fff"}}>{lab}
      <span style={{filter:"invert(1)"}}><Ajuda oq={oq} como={como}/></span></div>
    <div style={{...F.title,fontWeight:800,lineHeight:.9,marginTop:10,fontSize:"clamp(96px,13vw,240px)",color:"#fff"}}>{num}</div>
    {/* A porcentagem é o que a fábrica olha de longe: vem em destaque, não como legenda. */}
    {pct!=null&&<div style={{...F.title,fontWeight:800,lineHeight:1,marginTop:2,fontSize:"clamp(40px,5vw,86px)",color:"#fff"}}>{pct}%</div>}
    <div style={{...F.body,fontSize:"clamp(16px,1.6vw,26px)",marginTop:8,fontWeight:700,color:"#fff"}}>{sub}</div>
  </div>;
}
function MiniGV({lab,num,sub,cor,oq,como}){
  return <div style={{...cardBox,...(cor===C.red?{borderColor:"#9E0B0F33",background:"linear-gradient(180deg,#fff,#fdf4f4)"}:{})}}>
    <div style={{...F.title,textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"clamp(13px,1.2vw,19px)",fontWeight:700,color:C.black,display:"flex",gap:6,alignItems:"center"}}>{lab}{oq&&<Ajuda oq={oq} como={como}/>}</div>
    <div style={{...F.title,fontSize:"clamp(48px,5.5vw,92px)",fontWeight:800,lineHeight:1,marginTop:8,color:cor||C.black}}>{num}</div>
    <div style={{...F.body,fontSize:"clamp(13px,1.1vw,18px)",color:C.black,marginTop:5,fontWeight:700}}>{sub}</div>
  </div>;
}


// ─── PORTAL DO BORDADOR EXTERNO (dentro do SGP) ──────────────────────────────
// Tela única de um terceiro (Bordadel, MG Bordados). Ele vê SOMENTE as peças
// direcionadas a ele — e quem decide isso é o worker, a partir do cadastro do
// usuário. O front não manda filtro nenhum: não há o que adulterar aqui.
// Mostra só o necessário pra produzir: pedido, peça, tamanho, quantidade,
// posição, observação, prazo e o arquivo. Sem cliente, valor ou CNPJ.
function BordadorDemandas({user}){
  const [dados,setDados]=useState(null);
  const [loading,setLoading]=useState(true);
  const [erro,setErro]=useState("");
  const [verConcluidos,setVerConcluidos]=useState(false);
  const [busy,setBusy]=useState({});

  const carregar=()=>{
    setLoading(true);setErro("");
    apiFetch("/bordador/demandas","POST",{incluirConcluidos:verConcluidos})
      .then(r=>{ if(r.success)setDados(r); else setErro(r.error||"Não foi possível carregar."); })
      .catch(e=>setErro(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[verConcluidos]);

  const baixar=async(itemId,fileId,k)=>{
    setBusy(p=>({...p,[k]:true}));
    try{
      const r=await apiFetch("/bordador/arquivo","POST",{itemId,fileId});
      if(r.success&&r.url)window.open(r.url,"_blank");
      else alert(r.error||"Arquivo indisponível no momento.");
    }catch(e){alert("Erro: "+e.message);}
    finally{setBusy(p=>({...p,[k]:false}));}
  };
  const concluir=async(itemId)=>{
    if(!confirm("Confirmar que esta peça está bordada e pronta?"))return;
    setBusy(p=>({...p,[itemId]:true}));
    try{
      const r=await apiFetch("/bordador/concluir","POST",{itemId});
      if(r.success)carregar(); else alert(r.error||"Não foi possível registrar.");
    }catch(e){alert("Erro: "+e.message);}
    finally{setBusy(p=>({...p,[itemId]:false}));}
  };

  // Prazo em dias, tratando a data como DIA (não instante) — mesma regra do SGP.
  const diasAte=(iso)=>{
    const f=fimDoDiaVenc(iso);
    if(f==null)return null;
    const hoje=new Date();hoje.setHours(0,0,0,0);
    return Math.round((f-86399999-hoje.getTime())/86400000);
  };
  const ChipPrazo=({iso})=>{
    const n=diasAte(iso);
    if(n===null)return <Tag label="sem prazo" color={C.gray600}/>;
    if(n<0)return <Tag label={`atrasado ${Math.abs(n)}d`} color={C.red}/>;
    if(n===0)return <Tag label="entregar hoje" color={C.amber}/>;
    if(n<=3)return <Tag label={`faltam ${n}d`} color={C.amber}/>;
    return <Tag label={`faltam ${n}d`} color={C.green}/>;
  };

  const peds=dados?.pedidos||[];
  const totPecas=peds.reduce((s,p)=>s+p.pecas.filter(x=>!x.concluido).reduce((a,x)=>a+(x.quantidade||0),0),0);
  const totAtras=peds.filter(p=>{const n=diasAte(p.prazo);return n!==null&&n<0;}).length;

  return(
    <div style={{padding:20}}>
      <PageH title="Minhas demandas" sub={`Peças direcionadas para ${dados?.nome||"você"}. Baixe o arquivo e marque como concluída quando terminar.`}
        onRefresh={carregar} refreshing={loading}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:16}}>
        <Stat label="Pedidos" value={peds.length} icon="list"/>
        <Stat label="Peças a bordar" value={totPecas} icon="needle"/>
        <Stat label="Em atraso" value={totAtras} color={C.red} icon="warn"/>
      </div>

      <label style={{display:"inline-flex",alignItems:"center",gap:8,...F.body,fontSize:13,color:C.gray700,marginBottom:14,cursor:"pointer"}}>
        <input type="checkbox" checked={verConcluidos} onChange={e=>setVerConcluidos(e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
        Mostrar também o que já concluí
      </label>

      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:"12px 16px"}}>Carregando suas demandas...</div>}
      {erro&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>{erro}</div>}
      {!loading&&!erro&&peds.length===0&&
        <div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          Nenhuma peça com você no momento.
        </div>}

      {peds.map(p=>(
        <Card key={p.pedidoId} style={{marginBottom:14,borderLeft:`3px solid ${C.purple}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",paddingBottom:12,borderBottom:`1px solid ${C.gray100}`,marginBottom:6}}>
            <div>
              <div style={{...F.title,fontSize:17,fontWeight:700}}>Pedido {p.pedido}</div>
              <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:2}}>{p.pendentes} peça(s) pendente(s) · {p.totalPecas} no total</div>
            </div>
            <ChipPrazo iso={p.prazo}/>
          </div>
          {p.pecas.map(pc=>(
            <div key={pc.itemId} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 0",borderBottom:`1px solid ${C.gray100}`,flexWrap:"wrap"}}>
              <div style={{minWidth:56,textAlign:"center",background:C.gray100,borderRadius:9,padding:"8px 6px"}}>
                <div style={{...F.title,fontSize:21,fontWeight:700,lineHeight:1}}>{pc.quantidade||0}</div>
                <div style={{...F.body,fontSize:9.5,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:2}}>peças</div>
              </div>
              <div style={{flex:1,minWidth:180}}>
                <div style={{...F.body,fontSize:14,fontWeight:600}}>{pc.produto}</div>
                <div style={{...F.body,fontSize:12.5,color:C.gray600,marginTop:3}}>
                  Tamanho {pc.tamanho||"—"}{pc.cor?` · ${pc.cor}`:""}
                </div>
                {pc.observacao&&<div style={{...F.body,fontSize:12.5,color:C.amber,marginTop:4,fontWeight:600}}>⚠ {pc.observacao}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7,minWidth:170}}>
                {(pc.arquivos||[]).length>0
                  ? pc.arquivos.map((a,i)=>(
                      <Btn key={i} label={busy[pc.itemId+"-"+i]?"Abrindo...":`Baixar ${a.posicao||"arquivo"}`}
                        variant="secondary" size="sm" disabled={!!busy[pc.itemId+"-"+i]}
                        onClick={()=>baixar(pc.itemId,a.fileId,pc.itemId+"-"+i)}/>
                    ))
                  : <div style={{...F.body,fontSize:11.5,color:C.gray400,textAlign:"center"}}>Sem arquivo anexado</div>}
                {pc.concluido
                  ? <div style={{...F.body,fontSize:12.5,fontWeight:700,color:C.green,textAlign:"center",padding:"8px 0"}}>✓ Concluída</div>
                  : <Btn label={busy[pc.itemId]?"Registrando...":"Marcar concluída"} icon="check" variant="success" size="sm"
                      disabled={!!busy[pc.itemId]} onClick={()=>concluir(pc.itemId)}/>}
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

// ─── PEDIDOS EM RISCO ────────────────────────────────────────────────────────
function PedidosRisco(){
  const isMobile=useIsMobile();
  const [d,setD]=useState(null);const [loading,setLoading]=useState(true);const [erro,setErro]=useState(false);
  const [filtro,setFiltro]=useState("todos");
  const carregar=()=>{setLoading(true);setErro(false);apiFetch("/pedidos-risco").then(r=>{setD(r);setLoading(false);}).catch(()=>{setErro(true);setLoading(false);});};
  useEffect(carregar,[]);
  const RB={alto:"Alto",medio:"Médio",baixo:"Baixo"};
  const corNivel={alto:C.red,medio:C.amber,baixo:C.green};
  const bgNivel={alto:"#9E0B0F14",medio:"#b4530914",baixo:"#4B552814"};
  const lista=d?(filtro==="todos"?d.data:d.data.filter(o=>o.nivel===filtro)):[];
  return (
    <div style={{padding:isMobile?14:"18px 22px",maxWidth:980,margin:"0 auto"}}>
      <CabecalhoAnalise titulo="Pedidos em Risco" corBarra={C.amber}
        sub="Pedidos ainda no prazo, mas com etapas que já passaram do tempo previsto — aja antes de virar atraso."/>
      <EstadoCarga loading={loading} erro={erro} onRetry={carregar}/>
      {d&&!loading&&!erro&&<>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:14}}>
          <KpiR lab="Em risco" val={d.total} oq="Pedidos no prazo, mas ameaçados." como="Entra quem está parado além do tempo previsto (SLA) na etapa atual, vencendo em breve, aguardando o cliente ou em reprogramação. O motivo aparece em cada card."/>
          <KpiR lab="Risco alto" val={d.alto} cor={C.red}/>
          <KpiR lab="Risco médio" val={d.medio} cor={C.amber}/>
          <KpiR lab="Risco baixo" val={d.baixo} cor={C.gray600}/>
        </div>
        <div style={{...cardBox,padding:"10px 12px",display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          {[["todos","Todos ("+d.total+")"],["alto","Alto ("+d.alto+")"],["medio","Médio ("+d.medio+")"],["baixo","Baixo ("+d.baixo+")"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFiltro(k)} style={{...F.title,fontSize:12.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",
              border:`1px solid ${C.gray200}`,borderRadius:9,padding:"7px 12px",cursor:"pointer",
              background:filtro===k?C.black:C.white,color:filtro===k?"#fff":C.gray600}}>{l}</button>))}
        </div>
        {lista.length? lista.map((o,idx)=>(
          <div key={idx} style={{...cardBox,marginBottom:12,borderLeft:`5px solid ${corNivel[o.nivel]}`}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{...F.title,fontWeight:700,fontSize:16}}>{idPedido(o)}</div>
                <div style={{...F.body,fontSize:13,fontWeight:600,color:C.gray700}}>{o.cli}</div>
                <div style={{...F.body,fontSize:11.5,color:C.gray500,marginTop:1}}>Está em: {o.etapa} · {o.comBordado?"com bordado":"sem bordado"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <span style={{...F.title,fontWeight:600,fontSize:11.5,textTransform:"uppercase",letterSpacing:"0.05em",padding:"4px 11px",borderRadius:20,background:bgNivel[o.nivel],color:corNivel[o.nivel]}}>{RB[o.nivel]}</span>
                {o.buffer!=null&&<div style={{...F.body,fontSize:11,color:C.gray500,marginTop:4,fontWeight:600}}>{o.buffer===0?"vence hoje":o.buffer===1?"vence amanhã":`vence em ${o.buffer} dias`}</div>}
              </div>
            </div>
            {/* MOTIVO(S) DO RISCO */}
            <div style={{marginTop:11,paddingTop:10,borderTop:`1px solid ${C.gray100}`}}>
              <div style={{...F.title,fontSize:10.5,fontWeight:700,color:C.gray500,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Motivo do risco</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {(o.motivos||[]).map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:7,...F.body,fontSize:12.5,color:C.gray700}}>
                    <Ic n="warn" s={13} c={corNivel[o.nivel]} style={{marginTop:1,flexShrink:0}}/>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
              {o.vendedor&&<div style={{...F.body,fontSize:11,color:C.gray400,marginTop:7}}>Vendedor(a): {o.vendedor}{(()=>{const rp=responsavelPosVendaDe(o.vendedor);return rp?` · Pós-venda: ${rp}`:"";})()}</div>}
            </div>
          </div>)):<EstadoCarga vazio vazioTxt="Nenhum pedido em risco agora. Tudo sob controle. 🎉"/>}
      </>}
    </div>
  );
}
function KpiR({lab,val,cor,oq,como}){
  return <div style={cardBox}>
    <div style={{...F.body,fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:C.gray500,display:"flex",alignItems:"center",gap:6}}>
      <span style={{flex:1}}>{lab}</span>{oq&&<Ajuda oq={oq} como={como}/>}</div>
    <div style={{...F.title,fontSize:30,fontWeight:700,lineHeight:1.05,marginTop:5,color:cor||C.black}}>{val}</div>
  </div>;
}

// estilos de filtro reaproveitados
const lblFiltro={display:"block",...F.body,fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:C.gray500,marginBottom:4};
const inpFiltro={border:`1.5px solid ${C.gray200}`,borderRadius:7,padding:"8px 10px",...F.body,fontSize:13,outline:"none"};
function brData(iso){if(!iso)return"";const[y,m,dd]=iso.split("-");return `${dd}/${m}`;}

function AppInner(){
  const isMobile=useIsMobile();
  const _acoesEmAndamento=useRef(new Set()); // trava antiduplicação por pedido+ação
  const[user,setUser]=useState(()=>{
    try{
      const s=sessionStorage.getItem("sgp_user");
      if(!s)return null;
      const u=JSON.parse(s);
      // Migração: se for user da estrutura antiga (sem modulos e sem admin), descarta
      if(!u.modulos&&!u.admin){sessionStorage.removeItem("sgp_user");return null;}
      return u;
    }catch{return null;}
  });
  const doLogin=(u,sessao)=>{
    try{sessionStorage.setItem("sgp_user",JSON.stringify(u));}catch{}
    // Token de sessão individual — exigido pelas rotas do bordador externo.
    try{ if(sessao) localStorage.setItem("sgp_sessao",sessao); }catch{}
    setUser(u);
    // Bordador externo só tem uma tela: vai direto pra ela, ignorando hash.
    if(u.bordadorExterno){ setPage("bordador_demandas"); return; }
    // Se o usuário entrou direto numa URL com hash (#funil, etc), respeita
    if (!(typeof window !== "undefined" && window.location.hash && window.location.hash.length > 1)) {
      setPage(u.admin ? "raiox" : "demandas"); // admin cai no Raio-X
    }
  };
  const doLogout=()=>{
    try{sessionStorage.removeItem("sgp_user");}catch{}
    try{localStorage.removeItem("sgp_sessao");}catch{}
    setUser(null);
  };
  // Página persistida no hash da URL: F5 mantém o módulo atual, e dá pra
  // compartilhar link direto pra uma tela (ex: claude.ai#funil).
  const _pageFromHash = () => {
    if (typeof window === "undefined") return "demandas";
    const h = (window.location.hash || "").replace(/^#/, "").trim();
    return h || "demandas";
  };
  const[page,_setPageRaw]=useState(_pageFromHash);
  const setPage = (p) => {
    _setPageRaw(p);
    if (typeof window !== "undefined" && p && typeof p === "string") {
      try { window.history.replaceState(null, "", "#" + p); } catch(e){}
    }
  };
  // Se o usuário usar voltar/avançar do navegador, sincroniza
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fn = () => _setPageRaw(_pageFromHash());
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  const[orders,setOrders]=useState(ORDERS_INIT);
  const[sel,setSel]=useState(null);
  const[collapsed,setCollapsed]=useState(false);
  const[showN,setShowN]=useState(false);
  const[slaCfg,setSlaCfg]=useState({...SLA_DEF});
  const[notifs,setNotifs]=useState([]);      // notificações do usuário atual
  const[usuarios,setUsuarios]=useState([]);  // lista para @menção
  const[buscaPedidos,setBuscaPedidos]=useState(""); // busca inicial em Todos os Pedidos
  const naoLidas=notifs.filter(n=>!n.lida).length;
  const[chatResumo,setChatResumo]=useState({total:0,porPedido:{},mencoes:0}); // badge do chat
  // Contadores do menu: quantos pedidos em cada caixa. Sai do snapshot que o
  // app já tem em memória (fonte única, cache no Worker) — nenhuma chamada nova.
  const snapMenu=useSnapshotAberto();
  const contagensMenu=useMemo(()=>{
    const porEtapa=snapMenu.data?.porEtapa;
    if(!porEtapa)return {};
    const out={};
    for(const [modulo,etapa] of Object.entries(MODULO_ETAPA)){
      const g=porEtapa[etapa];
      const n=g&&Array.isArray(g.items)?g.items.length:0;
      // Módulos que apontam pra mesma etapa (ex.: Amostra Digital e Alteração
      // de Amostra Digital) recebem a mesma contagem — é a fila que importa.
      if(n>0)out[modulo]=n;
    }
    return out;
  },[snapMenu.data]);
  const[chatPedido,setChatPedido]=useState(null); // pedido a abrir direto no chat
  const carregarChatResumo=()=>{
    if(!user?.email)return;
    apiFetch("/chat/resumo?email="+encodeURIComponent(user.email))
      .then(r=>{if(r&&r.success)setChatResumo({total:r.total||0,porPedido:r.porPedido||{},mencoes:r.mencoes||0});})
      .catch(()=>{});
  };

  // Carrega notificações do usuário (e atualiza a cada 30s)
  const carregarNotifs=()=>{
    if(!user?.email)return;
    apiFetch("/notificacoes?email="+encodeURIComponent(user.email))
      .then(r=>{if(r&&r.success)setNotifs(r.data||[]);})
      .catch(()=>{});
  };
  const carregarUsuarios=()=>{
    apiFetch("/usuarios").then(r=>{
      const lista=r?.users||r?.usuarios||r?.data||(Array.isArray(r)?r:[]);
      setUsuarios(lista);
    }).catch(()=>{});
  };
  useEffect(()=>{
    if(!user)return;
    carregarNotifs();
    carregarUsuarios();
    carregarChatResumo();
    const t=setInterval(()=>{carregarNotifs();carregarUsuarios();carregarChatResumo();},30000);
    return ()=>clearInterval(t);
  },[user?.email]);

  // Hidrata o SLA salvo (KV) no boot. Sem isso, o slaCfg do app fica preso em
  // SLA_DEF (ex.: Programação 8h) após qualquer F5, mesmo que o admin tenha
  // salvo outro valor em Configurações — as filas mostravam o SLA errado.
  useEffect(()=>{
    if(!user)return;
    apiFetch("/config-sla").then(r=>{
      if(r&&r.success&&r.config&&r.config.etapas){
        setSlaCfg(prev=>({...prev,...r.config.etapas}));
      }
    }).catch(()=>{});
  },[user?.email]);

  // Abre o sino: marca todas como lidas
  const toggleBell=()=>{
    setShowN(s=>{
      const aberto=!s;
      if(aberto&&naoLidas>0&&user?.email){
        apiFetch("/notificacoes/marcar-lidas","POST",{email:user.email})
          .then(()=>setNotifs(list=>list.map(n=>({...n,lida:true}))))
          .catch(()=>{});
      }
      return aberto;
    });
  };
  // Clica numa notificação: vai para Todos os Pedidos já buscando o pedido
  const abrirPedidoNotif=(n)=>{
    setBuscaPedidos(String(n.pedido_id||""));
    setPage("pedidos");
    setShowN(false);
  };

  const handleAction=async(orderId,tipo,payload)=>{
    // O pedido aberto no modal (vem do HubSpot via Fila/Direcionamento)
    const o = sel && sel.id===orderId ? sel : null;
    if(!o){ setSel(null); return; }
    // Trava antiduplicação: ignora reenvio da MESMA ação no mesmo pedido (clique/efeito duplo)
    const _acaoKey=`${orderId}:${tipo}`;
    if(_acoesEmAndamento.current.has(_acaoKey)) return;
    _acoesEmAndamento.current.add(_acaoKey);
    const _liberar=()=>setTimeout(()=>_acoesEmAndamento.current.delete(_acaoKey),2000);
    let resultMsg="";
    // Contexto enviado em toda ação (executor + IDs) para nota e Supabase
    const ctx={
      executor:user?.nome||user?.name||"Sistema",
      executorEmail:user?.email||"",
      vendasId:o.vendasId||null,
      posvendaId:o.posvendaId||null,
      bordadoId:o.bordadoId||null,
      cliente:o.client||"",
      etapa:o.etapa||"",
      prazoFinal:o.prazoFinal||null,
      centroCusto:o.centroCusto||"",
      temBordado:o.temBordado!==false,
    };

    const bordadoId = o.bordadoId;

    try{
      // ── DIRECIONAMENTO ────────────────────────────────────────────────────────
      if(tipo==="direcionamento"){
        if(o.bordadoId&&o.posvendaId){
          await apiFetch(`/direcionamento/${o.posvendaId}`,"PATCH",{
            bordadoId:o.bordadoId,
            destinos:payload.destinos,
            ctx,
          });
        }
      }

      // ── CONFERIDO (pedido SEM bordado) na Conf. e Direcionamento → Expedição ───
      else if(tipo==="conferir_direcionamento"){
        if(!o.posvendaId){ alert("Pedido sem pós-venda associado."); return; }
        const res=await apiFetch(`/apenas-conferido/${o.posvendaId}`,"POST",{ obs:payload.obs||"", ctx });
        if(res.error) throw new Error(res.error);
        resultMsg="Conferido — movido para Expedição.";
      }

      // ── SOB MEDIDA: registrar a OP → Aguardando Produção ───────────────────────
      else if(tipo==="op_sob_medida"){
        if(!o.posvendaId){ alert("Pedido sem pós-venda associado."); return; }
        const res=await apiFetch(`/op-sob-medida/${o.posvendaId}`,"POST",{ numeroOP:payload.numeroOP, obs:payload.obs||"", ctx });
        if(res.error) throw new Error(res.error);
        resultMsg=`OP ${payload.numeroOP} registrada. Pedido em Aguardando Produção Sob Medida.`;
      }

      // ── SOB MEDIDA: produção concluída → Conferência e Direcionamento ──────────
      else if(tipo==="producao_sm_concluida"){
        if(!o.posvendaId){ alert("Pedido sem pós-venda associado."); return; }
        const res=await apiFetch(`/producao-sm-concluida/${o.posvendaId}`,"POST",{ obs:payload.obs||"", ctx });
        if(res.error) throw new Error(res.error);
        resultMsg="Produção concluída — pedido liberado para Conferência e Direcionamento.";
      }

      // ── UPLOAD (Programação, Amostra Digital, Amostra Física) ──────────────────
      else if(tipo==="upload"){
        const nextMap={
          "Programação":"Amostra Digital",
          "Amostra Digital":"Aprovação de Amostra Digital",
          "Amostra Física":"Aprovação de Amostra Física",
        };
        const next=nextMap[o.etapa]||o.etapa;
        if(!bordadoId){ alert("Pedido sem negócio de Bordado associado."); return; }
        // Slot com N arquivos: manda a lista; o par solto vai junto só por compat.
        const arqs=payload.arquivos&&payload.arquivos.length
          ? payload.arquivos
          : (payload.fileBase64&&payload.fileName?[{fileBase64:payload.fileBase64,fileName:payload.fileName}]:[]);
        if(!arqs.length||!payload.propriedade){ alert("Arquivo ou propriedade ausente."); return; }
        const nomes=arqs.map(a=>a.fileName).join(", ");
        const res=await apiFetch(`/upload-etapa/${bordadoId}`,"POST",{
          propriedade:payload.propriedade,
          propMotivo:ETAPA_PROP_MOTIVO[o.etapa]||"",
          arquivos:arqs,
          fileBase64:arqs[0].fileBase64,
          fileName:arqs[0].fileName,
          sku:payload.sku||o.items?.find(it=>it.bordado)?.sku||"",
          novaEtapa:ETAPA_STAGE_ID[next],
          nota:`${o.etapa} → ${next} (${arqs.length>1?arqs.length+" arquivos":"arquivo"}: ${nomes})`,
          ctx,
        },{timeoutMs:UPLOAD_TIMEOUT_MS});
        if(res.error) throw new Error(res.error);
        if(arqs.length>1) resultMsg=`${arqs.length} arquivos enviados. ${o.etapa} → ${next}.`;
      }

      // ── AVANÇAR ETAPA quando todos os bordados já foram executados ─────────
      // Não há nada novo pra enviar — só move o deal de Bordado pra próxima etapa.
      else if(tipo==="avancar_programacao"){
        if(!bordadoId){ alert("Pedido sem negócio de Bordado associado."); return; }
        const nextMap={
          "Programação":"Amostra Digital",
          "Amostra Digital":"Aprovação de Amostra Digital",
          "Amostra Física":"Aprovação de Amostra Física",
        };
        const next=nextMap[o.etapa]||o.etapa;
        const res=await apiFetch(`/mover-etapa/${bordadoId}`,"PATCH",{
          novaEtapa:ETAPA_STAGE_ID[next],
          nota:`${o.etapa} → ${next} (todos os bordados já executados)`,
          ctx,
        });
        if(res.error) throw new Error(res.error);
        resultMsg=`Pedido avançado para ${next}.`;
      }

      // ── EXECUÇÃO POR BORDADO (Programação c/ dificuldade · Amostras s/ dificuldade) ─
      else if(tipo==="exec_bordado"){
        if(!bordadoId){ alert("Pedido sem negócio de Bordado associado."); return; }
        if(!payload.execucoes||!payload.execucoes.length){ alert("Nenhum bordado para enviar."); return; }
        const nextMap={
          "Programação":"Amostra Digital",
          "Amostra Digital":"Aprovação de Amostra Digital",
          "Amostra Física":"Aprovação de Amostra Física",
        };
        const next=nextMap[o.etapa]||o.etapa;
        const res=await apiFetch(`/programacao-exec/${bordadoId}`,"POST",{
          execucoes:payload.execucoes,
          anexos:payload.anexos||{},   // arquivos enviados 1x, referenciados por {ref}
          propriedade:ETAPA_PROPRIEDADE[o.etapa],
          propMotivo:ETAPA_PROP_MOTIVO[o.etapa]||"",
          propriedadeEmb:payload.propriedadeEmb||"",
          novaEtapa:ETAPA_STAGE_ID[next],
          nota:`${o.etapa} → ${next}`,
          ctx,
        },{timeoutMs:UPLOAD_TIMEOUT_MS});
        if(res.error) throw new Error(res.error);
        // Se stage não avançou (ainda faltam outros bordados desse pedido)
        if (res.stageAvancou === false && res.bordadosPendentes?.length > 0) {
          const nomes = res.bordadosPendentes.slice(0, 5)
            .map(n => `• ${n.replace(/\s*~(PROG|AMOSTRA)/gi, "").trim()}`).join("\n");
          const extra = res.bordadosPendentes.length > 5 ? `\n... e mais ${res.bordadosPendentes.length - 5}` : "";
          resultMsg = `Sua parte foi registrada (${res.arquivos} arquivo${res.arquivos!==1?"s":""}).\n\n` +
                      `O pedido ainda NÃO avançou pra próxima etapa porque faltam ${res.bordadosPendentes.length} bordado${res.bordadosPendentes.length!==1?"s":""}:\n\n` +
                      nomes + extra +
                      `\n\nOutros membros da equipe precisam executar os pendentes.`;
        } else {
          resultMsg=`${o.etapa} registrada e enviada para ${next}.`;
        }
        if(res.relatorioGravado===false){
          resultMsg+=` ⚠ Atenção: o relatório de programação não foi gravado (${res.relatorioErro||"verifique a tabela programacao_execucoes no Supabase"}).`;
        }
      }

      // ── ALTERAÇÃO DE FORMULÁRIO (pós-venda) ────────────────────────────────────
      else if(tipo==="alteracao_formulario"){
        if(!bordadoId) throw new Error("Pedido sem negócio de Bordado.");
        const stageDestino=ETAPA_STAGE_ID[payload.novaEtapa];
        if(!stageDestino) throw new Error("Etapa de destino inválida.");
        const res=await apiFetch(`/alteracao-formulario/${bordadoId}`,"PATCH",{
          novaEtapa:stageDestino,
          motivo:payload.motivo,
          ctx,
        });
        if(res.error) throw new Error(res.error);
        resultMsg="Alteração de formulário registrada. Pedido retornado para "+payload.novaEtapa+".";
      }

      // ── APROVAR AMOSTRA (pós-venda) ────────────────────────────────────────────
      else if(tipo==="aprovar_amostra"){
        const next=o.etapa==="Aprovação de Amostra Digital"?"Amostra Física":"Liberado para bordar";
        if(bordadoId&&ETAPA_STAGE_ID[next]){
          await apiFetch(`/mover-etapa/${bordadoId}`,"PATCH",{novaEtapa:ETAPA_STAGE_ID[next],nota:`Amostra aprovada → ${next}`,ctx});
        }
      }

      // ── APROVAR AMOSTRA FÍSICA c/ anexo do vendedor (opcional, multi-bordado) ───
      else if(tipo==="aprovar_amostra_fisica"){
        if(!bordadoId) throw new Error("Pedido sem negócio de Bordado.");
        const arqsAF=payload.arquivos&&payload.arquivos.length
          ? payload.arquivos
          : (payload.fileBase64&&payload.fileName?[{fileBase64:payload.fileBase64,fileName:payload.fileName}]:[]);
        const res=await apiFetch(`/aprovar-amostra-fisica/${bordadoId}`,"POST",{
          arquivos:arqsAF,
          fileBase64:arqsAF[0]?.fileBase64||null,
          fileName:arqsAF[0]?.fileName||null,
          bordadoKeys:payload.bordadoKeys||[],
          obs:payload.obs||"",
          ctx,
        },{timeoutMs:UPLOAD_TIMEOUT_MS});
        if(res.error) throw new Error(res.error);
        resultMsg=arqsAF.length
          ?`Amostra física aprovada e ${arqsAF.length>1?arqsAF.length+" arquivos anexados":"anexada"}. Pedido liberado para bordar.`
          :"Amostra física aprovada. Pedido liberado para bordar.";
      }

      // ── CONFIRMAR AMOSTRA FÍSICA PRONTA (executor — sem anexar) ─────────────────
      else if(tipo==="confirmar_amostra_fisica"){
        if(!bordadoId) throw new Error("Pedido sem negócio de Bordado.");
        await apiFetch(`/mover-etapa/${bordadoId}`,"PATCH",{
          novaEtapa:ETAPA_STAGE_ID["Aprovação de Amostra Física"],
          nota:"Amostra física pronta → Aprovação de Amostra Física",ctx,
        });
        resultMsg="Amostra física confirmada. Enviada para aprovação do vendedor.";
      }

      // ── REPROVAR AMOSTRA (limpa arquivo + volta etapa) ─────────────────────────
      else if(tipo==="reprovar_amostra"){
        // Regra do processo:
        //   Aprovação Digital reprovada → volta pra Amostra Digital (refaz digital)
        //   Aprovação Física reprovada → volta pra AMOSTRA FÍSICA (refaz a física;
        //     antes voltava pra digital, o que misturava as duas reprogramações
        //     na mesma fila e tirava a demanda de quem faz a peça).
        const voltaMap={
          "Aprovação de Amostra Digital":"Amostra Digital",
          "Aprovação de Amostra Física":"Amostra Física",
        };
        const volta=voltaMap[o.etapa]||"Amostra Digital";
        const propVolta=ETAPA_PROPRIEDADE[volta];
        const propMotivo=ETAPA_PROP_MOTIVO[volta];
        if(bordadoId&&ETAPA_STAGE_ID[volta]){
          await apiFetch(`/reprovar/${bordadoId}`,"PATCH",{
            propriedade:propVolta,
            propMotivo:propMotivo,
            motivo:payload.obs||"",
            novaEtapa:ETAPA_STAGE_ID[volta],
            ctx,
          });
        }
      }

      // ── CONCLUSÃO DE BORDADO (interno/externo, aguarda ambos) ──────────────────
      else if(tipo==="mover"&&(o.etapa==="Bordado Interno"||o.etapa==="Bordado Externo"||o.etapa==="Bordado Interno e Externo")){
        if(!bordadoId) throw new Error("Pedido sem negócio de Bordado.");
        // O lado depende de qual fila/etapa o operador está
        const lado=payload.lado||(o.etapa==="Bordado Externo"?"externo":"interno");
        const res=await apiFetch(`/concluir-bordado/${bordadoId}`,"PATCH",{lado,ctx});
        if(res.error) throw new Error(res.error);
        // Monta a mensagem de retorno conforme o resultado
        if(res.totalmenteConcluido){
          resultMsg=res.posVendaMovido
            ? "Bordado finalizado! Ambos os lados concluídos. O pedido foi enviado para Expedição."
            : "Bordado finalizado! Ambos os lados concluídos.";
        }else{
          const falta=lado==="interno"?"externo":"interno";
          resultMsg=`Lado ${lado} concluído! Aguardando o lado ${falta} para finalizar e enviar à Expedição.`;
        }
      }

      // ── MOVIMENTAÇÃO PÓS-VENDA (Expedição → Análise de Frete → Finalizado) ────
      else if(tipo==="mover"&&(o.etapa==="Expedição"||o.etapa==="Análise de Frete")){
        if(!o.posvendaId) throw new Error("Pedido sem negócio de Pós-venda.");
        const stageMap={
          "Expedição":         "1377587761", // → Análise de frete
          "Análise de Frete":  "1377587762", // → Faturado (Finalizados)
        };
        const nomeProx = {
          "Expedição": "Análise de Frete",
          "Análise de Frete": "Finalizados",
        };
        const novaEtapa=stageMap[o.etapa];
        const rMov=await apiFetch(`/mover-posvenda/${o.posvendaId}`,"PATCH",{novaEtapa,nota:`${o.etapa} concluída`,ctx});
        // O worker pode DESVIAR o destino: se o faturamento não está liberado,
        // o pedido vai pra Pendente Pagamento em vez de Análise de Frete.
        resultMsg = rMov?.travadoPorPagamento
          ? "Expedição concluída, mas o pagamento deste pedido NÃO foi liberado.\n\nO pedido foi para a caixa PENDENTE PAGAMENTO. Ele volta sozinho para a Análise de Frete assim que o ERP confirmar o pagamento."
          : `Pedido movido para ${nomeProx[o.etapa]}.`;
      }

      // ── EM SEPARAÇÃO SEM ITENS → ANÁLISE PCP ───────────────────────────────────
      else if(tipo==="mover"&&o.etapa==="Em Separação"){
        if(!o.posvendaId) throw new Error("Pedido sem negócio de Pós-venda.");
        await apiFetch(`/mover-posvenda/${o.posvendaId}`,"PATCH",{novaEtapa:"1400475806",nota:"Sem itens para separar — enviado direto para Análise PCP",ctx});
        resultMsg="Pedido enviado para Análise PCP.";
      }

      // ── MOVIMENTAÇÃO SIMPLES (fallback) ────────────────────────────────────────
      else if(tipo==="mover"){
        const nextMap={};
        const next=nextMap[o.etapa]||o.etapa;
        if(bordadoId&&ETAPA_STAGE_ID[next]){
          await apiFetch(`/mover-etapa/${bordadoId}`,"PATCH",{novaEtapa:ETAPA_STAGE_ID[next],nota:`${o.etapa} → ${next}`,ctx});
        }
      }

    }catch(e){
      alert("Erro ao processar: "+e.message);
      console.error("handleAction:",e);
      throw e; // propaga para o botão não marcar como concluído
    }finally{
      _liberar();
    }

    // Sucesso — o card sai da caixa NA HORA (remoção otimista) e o quadro é
    // reconstruído logo atrás. Sem isso, o usuário ficava alguns segundos vendo
    // o pedido ainda na fila depois de tomar a ação e achava que não pegou.
    // A etapa de origem é a que o usuário estava olhando (_etapaOrigem).
    snapRemoverPedido(o.vendasId, o._etapaOrigem || o.etapa);
    // Refresh SEM force: a ação já apagou o cache do worker, então a próxima
    // leitura reconstrói uma única vez e todo mundo passa a ler o dado novo.
    // Forçar aqui fazia CADA ação disparar um rebuild de 5-8s só pra quem agiu.
    // 2s dá tempo do HubSpot indexar a nova etapa antes da reconstrução.
    setTimeout(()=>{ triggerRefresh(); _fetchSnap(false); }, 2000);
    return resultMsg||"O pedido foi movimentado com sucesso.";
  };

  const TITLES={
    raiox:"Raio-X do Sistema",chat:"Chat dos Pedidos",
    demandas:"Minhas Demandas",dashboard:"Dashboard",funil:"Funil em Tempo Real",
    painel_fluxo:"Painel de Fluxo",gestao_vista:"Gestão à Vista",pedidos_risco:"Pedidos em Risco",
    gerencial:"Gerencial",historico:"Histórico",ranking:"Ranking / Premiação",
    pedidos:"Pedidos em Aberto",direcionamento:"Direcionamento",
    analise_pcp:"Análise PCP",buscar_loja:"Buscar Produto em Loja",analise_producao:"Análise da Produção",
    op_sob_medida:"Criação de OP Sob Medida",aguardando_producao_sm:"Aguardando Produção Sob Medida",
    bonificacoes:"Bonificações",
    ocorrencias:"Painel de Ocorrências",ocor_entrada_devolucao:"Entrada da Devolução",
    ocor_ajuste_pedido:"Ajuste do Pedido",ocor_registro_reclamacao:"Registro de Reclamação",
    ocor_improcedencia:"Tratativa de Improcedência",
    programacao:"Programação",amostra_digital:"Amostra Digital",amostra_fisica:"Amostra Física",
    alteracao_amostra_digital:"Alteração de Amostra Digital",alteracao_amostra_fisica:"Alteração de Amostra Física",
    bordado_interno:"Bordado Interno",bordado_externo:"Bordado Externo",silk_dtf:"Silk / DTF",
    expedicao:"Expedição",faturamento:"Faturamento",finalizados:"Finalizados",alteracoes_form:"Alterações de Formulário",codigos_barra:"Códigos de Barra",impressao_pedido:"Impressão de Pedido",sla:"Configurações",usuarios:"Usuários",
  };
  const nav=id=>{setPage(id);setShowN(false);};

  if(!user)return <Login onLogin={doLogin}/>;

  return(
    <div style={{display:"flex",height:"100dvh",...F.body,background:C.gray100,overflow:"hidden",flexDirection:"column"}}>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {!isMobile&&<Sidebar user={user} active={page} onNav={nav} collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)} chatTotal={chatResumo.mencoes} contagens={contagensMenu}/>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <Topbar user={user} title={TITLES[page]||""} naoLidas={naoLidas} onBell={toggleBell} onLogout={doLogout} isMobile={isMobile}/>
          {showN&&<NotifPanel notifs={notifs} onClose={()=>setShowN(false)} onAbrir={abrirPedidoNotif}/>}
          <div className="sgp-scroll" style={{flex:1,overflowY:"auto",paddingBottom:isMobile?70:0}}>
            {page==="raiox"&&(user.admin?<RaioX user={user} onOpen={setSel} slaCfg={slaCfg} onIrChat={(pid)=>{setChatPedido(pid);setPage("chat");}}/>:<div style={{padding:40,textAlign:"center",...F.body,color:C.gray500}}>Acesso restrito a administradores.</div>)}
            {page==="chat"&&<ChatPage user={user} usuarios={usuarios} chatResumo={chatResumo} onResumo={carregarChatResumo} pedidoInicial={chatPedido} onLimparInicial={()=>setChatPedido(null)}/>}
            {page==="demandas"&&<MinhasDemandas user={user} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="dashboard"&&<Dashboard orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="funil"&&<Funil onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="painel_fluxo"&&<PainelFluxo/>}
            {page==="gestao_vista"&&<GestaoVista/>}
            {page==="pedidos_risco"&&<PedidosRisco/>}
            {page==="pedidos"&&<TodosPedidos onOpen={setSel} slaCfg={slaCfg} initialBusca={buscaPedidos}/>}
            {page==="em_separacao"&&<Fila title="Em Separação" etapa="Em Separação" endpoint="/em-separacao" orders={orders} onOpen={setSel} actionLabel="Ver pedido" actionColor={C.gray500} slaCfg={slaCfg}/>}
            {page==="conferencia_separacao"&&<ConferenciaSeparacao orders={orders} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="op_sob_medida"&&<CaixaPCP title="Criação de OP Sob Medida" sub="Pedidos sob medida aguardando a abertura da ordem de produção." endpoint="/op-sob-medida" etapaLabel="Criação de OP Sob Medida" acoes={[
              {label:"Registrar OP", cor:C.red, icon:"check", apiPath:"/op-sob-medida",
               pedirCampo:{chave:"numeroOP", label:"Número da OP"}},
            ]} onOpen={setSel} slaCfg={slaCfg} user={user} semFaltantes/>}
            {page==="aguardando_producao_sm"&&<CaixaPCP title="Aguardando Produção Sob Medida" sub="Peças sob medida em produção. Ao concluir, o pedido segue para Conferência e Direcionamento." endpoint="/aguardando-producao-sm" etapaLabel="Aguardando Produção Sob Medida" acoes={[
              {label:"Produção concluída", cor:C.green, icon:"check", apiPath:"/producao-sm-concluida",
               confirmMsg:"Confirmar que a produção da peça sob medida foi concluída? O pedido vai para Conferência e Direcionamento."},
            ]} onOpen={setSel} slaCfg={slaCfg} user={user} semFaltantes/>}
            {page==="bonificacoes"&&<Bonificacoes onOpen={setSel} user={user}/>}
            {page==="silk_dtf"&&<SilkDtf onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {/* ── OCORRÊNCIA (devolução / reclamação) ─────────────────────── */}
            {page==="ocorrencias"&&<CaixaOcorrencia title="Painel de Ocorrências"
              sub="Tudo que está aberto no funil de ocorrência, em qualquer etapa."
              endpoint="/ocorrencias" etapaLabel="Ocorrência" modo="painel"
              onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="ocor_entrada_devolucao"&&<CaixaOcorrencia title="Entrada da Devolução"
              sub="Faturamento: dar entrada na nota de devolução. Ao confirmar, segue para o Ajuste do Pedido."
              endpoint="/ocor-entrada-devolucao" etapaLabel="Entrada da Devolução" modo="simples"
              acaoLabel="Entrada realizada" apiPath="/ocor-entrada-devolucao"
              onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="ocor_ajuste_pedido"&&<CaixaOcorrencia title="Ajuste do Pedido"
              sub="Pós-Venda: fazer as alterações necessárias no pedido. Ao concluir, segue para a Qualidade."
              endpoint="/ocor-ajuste-pedido" etapaLabel="Ajuste do Pedido" modo="simples"
              acaoLabel="Ajustes concluídos" apiPath="/ocor-ajuste-pedido"
              onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="ocor_registro_reclamacao"&&<CaixaOcorrencia title="Registro de Reclamação"
              sub="Qualidade: analisar e dar o parecer. Procedente libera a separação; improcedente abre tratativa."
              endpoint="/ocor-registro-reclamacao" etapaLabel="Registro de Reclamação" modo="qualidade"
              onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="ocor_improcedencia"&&<CaixaOcorrencia title="Tratativa de Improcedência"
              sub="Pós-Venda avisa o cliente e a Separação dá baixa no estoque. Encerra quando os dois concluírem."
              endpoint="/ocor-improcedencia" etapaLabel="Tratativa de Improcedência" modo="improcedencia"
              onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="analise_pcp"&&<CaixaPCP title="Análise PCP" sub="Pedidos separados parciais aguardando decisão do PCP." endpoint="/analise-pcp" etapaLabel="Análise PCP" acoes={[
              {label:"Buscar em loja", cor:C.purple, icon:"inbox", apiPath:"/pcp-rotear", body:{destino:"loja"}},
              {label:"Enviar p/ produção", cor:"#0891b2", icon:"box", apiPath:"/pcp-rotear", body:{destino:"producao"}},
              {label:"Enviar p/ Conf. e Direcionamento", cor:C.green, icon:"check", apiPath:"/pcp-concluir", confirmMsg:"Enviar este pedido direto para Conferência e Direcionamento?"},
              {label:"Enviar p/ Conf. Separação", cor:C.gray600, icon:"arrow", apiPath:"/pcp-rotear", body:{destino:"separacao"}, confirmMsg:"Devolver este pedido para a Conferência de Separação?"},
            ]} onOpen={setSel} slaCfg={slaCfg} user={user} faltantesExtraEndpoints={["/buscar-loja","/analise-producao"]}/>}
            {page==="buscar_loja"&&<CaixaPCP title="Buscar Produto em Loja" sub="Ao concluir a busca, o pedido vai pra Retirar e Conferir." endpoint="/buscar-loja" etapaLabel="Buscar em Loja" acoes={[
              {label:"Concluído", cor:C.green, icon:"check", apiPath:"/pcp-concluir", confirmMsg:"Concluir a busca em loja e mandar o pedido pra Retirar e Conferir?"},
              {label:"Enviar p/ Conf. Separação", cor:C.gray600, icon:"arrow", apiPath:"/pcp-rotear", body:{destino:"separacao"}, confirmMsg:"Devolver este pedido para a Conferência de Separação?"},
            ]} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="analise_producao"&&<CaixaPCP title="Análise da Produção" sub="Ao concluir a análise, o pedido vai pra Retirar e Conferir." endpoint="/analise-producao" etapaLabel="Análise Produção" acoes={[
              {label:"Concluído", cor:C.green, icon:"check", apiPath:"/pcp-concluir", confirmMsg:"Concluir a análise da produção e mandar o pedido pra Retirar e Conferir?"},
              {label:"Enviar p/ Conf. Separação", cor:C.gray600, icon:"arrow", apiPath:"/pcp-rotear", body:{destino:"separacao"}, confirmMsg:"Devolver este pedido para a Conferência de Separação?"},
            ]} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="conferencia_direcionamento"&&<Direcionamento orders={orders} setOrders={setOrders} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="programacao"&&<Fila title="Programação de Bordado" etapa="Programação" endpoint="/programacao" orders={orders} onOpen={setSel} actionLabel="Marcar como programado" actionColor={C.amber} slaCfg={slaCfg} subTabExecutados user={user}/>}
            {page==="amostra_digital"&&<Fila title="Amostra Digital" etapa="Amostra Digital" endpoint="/amostra-digital" orders={orders} onOpen={setSel} actionLabel="Enviar amostra" actionColor={C.purple} slaCfg={slaCfg} modoReprog="sem"/>}
            {page==="alteracao_amostra_digital"&&<Fila title="Alteração de Amostra Digital" sub="Amostras digitais reprovadas que precisam ser refeitas" etapa="Amostra Digital" endpoint="/amostra-digital" orders={orders} onOpen={setSel} actionLabel="Enviar amostra" actionColor="#c2410c" slaCfg={slaCfg} modoReprog="somente"/>}
            {page==="amostra_fisica"&&<Fila title="Amostra Física" etapa="Amostra Física" endpoint="/amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Notificar vendedor" actionColor="#be185d" slaCfg={slaCfg} modoReprog="sem"/>}
            {page==="alteracao_amostra_fisica"&&<Fila title="Alteração de Amostra Física" sub="Amostras físicas reprovadas que precisam ser refeitas" etapa="Amostra Física" endpoint="/amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Notificar vendedor" actionColor="#c2410c" slaCfg={slaCfg} modoReprog="somente"/>}
            {page==="aprovacao_amostra_digital"&&<Fila title="Aprovação de Amostra Digital" etapa="Aprovação de Amostra Digital" endpoint="/aprovacao-amostra-digital" orders={orders} onOpen={setSel} actionLabel="Aprovar/Reprovar" actionColor={C.blue} slaCfg={slaCfg}/>}
            {page==="aprovacao_amostra_fisica"&&<Fila title="Aprovação de Amostra Física" etapa="Aprovação de Amostra Física" endpoint="/aprovacao-amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Aprovar/Reprovar" actionColor={C.blue} slaCfg={slaCfg}/>}
            {page==="bordado_interno"&&<Fila title="Bordado Interno" etapa="Bordado Interno" endpoint="/bordado-interno" orders={orders} onOpen={setSel} actionLabel="Bordado concluído" actionColor={C.green} slaCfg={slaCfg}/>}
            {page==="bordado_externo"&&<BordadoExternoPage orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="expedicao"&&<Fila title="Expedição" etapa="Expedição" endpoint="/expedicao" orders={orders} onOpen={setSel} actionLabel="Enviar p/ análise de frete" actionColor={C.teal} slaCfg={slaCfg}/>}
            {page==="analise_frete"&&<Fila title="Análise de Frete" etapa="Análise de Frete" endpoint="/analise-frete" orders={orders} onOpen={setSel} actionLabel="Finalizar pedido" actionColor="#0891b2" slaCfg={slaCfg}/>}
            {page==="bordador_demandas"&&<BordadorDemandas user={user}/>}
            {page==="pendente_pagamento"&&<PendentePagamento onOpen={setSel} user={user}/>}
            {page==="finalizados"&&<FinalizadosPage onOpen={setSel}/>}
            {page==="alteracoes_form"&&<AlteracoesFormList/>}
            {page==="codigos_barra"&&<CodigosBarra user={user}/>}
            {page==="impressao_pedido"&&<ImpressaoPedido user={user}/>}
            {page==="pendencia_comercial"&&<PendenciaComercial user={user}/>}
            {page==="aguardando_pedido"&&<AguardandoOutroPedido user={user}/>}
            {page==="rel_pendencias"&&<RelatorioPendencias user={user}/>}
            {page==="posvenda"&&<PainelPosVenda onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="banco_imagens"&&<BancoImagens user={user}/>}
            {page==="sla"&&<SLAConfig slaCfg={slaCfg} onSave={setSlaCfg} user={user}/>}
            {page==="usuarios"&&<Usuarios/>}
          </div>
        </div>
      </div>
      {isMobile&&<BottomNav user={user} active={page} onNav={nav}/>}
      {sel&&<OrderModal order={sel} me={user} onClose={()=>setSel(null)} usuarios={usuarios} onAction={handleAction} isMobile={isMobile} slaCfg={slaCfg}/>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAINEL PÓS-VENDA
// Visão de gestão pra equipe de pós-venda. KPIs clicáveis + tabela + painel lateral.
// ═════════════════════════════════════════════════════════════════════════════
function PainelPosVenda({onOpen, slaCfg, user}) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroChip, setFiltroChip] = useState("todos"); // todos, atrasados, risco, pendencia, aguardando, sem_contato, vencem_hoje
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [filtroVendedores, setFiltroVendedores] = useState([]); // array de nomes
  const [filtroRespPV, setFiltroRespPV] = useState(""); // responsável pós-venda
  const rpv = useRespPV();
  const [vendedorDropdownAberto, setVendedorDropdownAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      // O /painel-posvenda já lê o snapshot da mesma fonte das outras telas
      // (cache no KV). A chamada extra a /snapshot-aberto que existia aqui era
      // pra "aquecer" um cache em memória que não é mais usado — só dobrava o
      // tempo de abertura da tela.
      const r = await apiFetch("/painel-posvenda");
      if (r.success) setDados(r);
      else setErro(r.error || "Erro desconhecido");
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { carregar(); }, []);

  const kpis = dados?.kpis || {};
  const pedidos = dados?.pedidos || [];
  const dist = dados?.distribuicaoEtapa || {};

  // Vendedores únicos pra dropdown
  const vendedores = Array.from(new Set(pedidos.map(p => p.vendedor).filter(Boolean))).sort();

  // Filtra
  const filtrados = pedidos.filter(p => {
    if (filtroChip === "atrasados" && !p.atrasado) return false;
    if (filtroChip === "risco" && !(p.risco && !p.atrasado)) return false;
    if (filtroChip === "pendencia" && !p.emPendencia) return false;
    if (filtroChip === "aguardando" && !p.aguardandoCliente) return false;
    if (filtroChip === "aguardando_outro" && !p.aguardandoOutro) return false;
    if (filtroChip === "vencem_hoje" && !p.vencemHoje) return false;
    if (filtroEtapa && !((p.etapasAtivas && p.etapasAtivas.length ? p.etapasAtivas : [p.etapa]).includes(filtroEtapa))) return false;
    if (filtroVendedores.length > 0 && !filtroVendedores.includes(p.vendedor)) return false;
    if (filtroRespPV && responsavelPosVendaDe(p.vendedor) !== filtroRespPV) return false;
    if (busca) {
      const q = busca.toLowerCase();
      const bate = (p.client || "").toLowerCase().includes(q)
        || (p.pedidoLinx || "").toLowerCase().includes(q)
        || (p.cnpj || "").includes(q)
        // Números do HubSpot: id de Vendas, Pós-venda e Bordado (e o "PED-...")
        || String(p.vendasId || "").includes(q)
        || String(p.posvendaId || "").includes(q)
        || String(p.bordadoId || "").includes(q)
        || String(p.id || "").toLowerCase().includes(q);
      if (!bate) return false;
    }
    return true;
  });

  // ⚠ Os KPIs vinham prontos do worker, calculados sobre TODOS os pedidos —
  // então filtrar por responsável/vendedor/etapa mudava só a tabela e os cards
  // continuavam mostrando os números da operação inteira. Quem filtrava a
  // própria carteira lia aqueles totais como sendo dela.
  // Agora os cards são recalculados sobre a MESMA lista que a tabela mostra.
  // "Faturados hoje" é o único que continua vindo do worker (é um recorte de
  // outra base, não está nesta lista) e por isso fica marcado como geral.
  const baseKpi = filtroChip === "todos" ? filtrados
    : pedidos.filter(p => {
        if (filtroEtapa && !((p.etapasAtivas && p.etapasAtivas.length ? p.etapasAtivas : [p.etapa]).includes(filtroEtapa))) return false;
        if (filtroVendedores.length > 0 && !filtroVendedores.includes(p.vendedor)) return false;
        if (filtroRespPV && responsavelPosVendaDe(p.vendedor) !== filtroRespPV) return false;
        return true;
      });
  const filtrandoAlgo = !!(filtroEtapa || filtroVendedores.length || filtroRespPV || busca);
  const k = {
    totalAtivos: baseKpi.length,
    valorTotalAtendimento: baseKpi.reduce((acc, p) => acc + Number(p.valor || 0), 0),
    atrasados: baseKpi.filter(p => p.atrasado).length,
    emRisco: baseKpi.filter(p => p.risco && !p.atrasado).length,
    vencemHoje: baseKpi.filter(p => p.vencemHoje).length,
    emPendencia: baseKpi.filter(p => p.emPendencia).length,
    aguardandoCliente: baseKpi.filter(p => p.aguardandoCliente).length,
    aguardandoOutroPedido: baseKpi.filter(p => p.aguardandoOutro).length,
  };

  // Cores das etapas
  const corEtapa = {
    // Faltavam as etapas novas: todas caíam em cinza e viravam um bloco único
    // indistinguível na barra de distribuição.
    "Pendente Pagamento": "#be123c", "Silk/DTF": "#7c3aed", "Bonificações": "#0d9488",
    "Criação de OP Sob Medida": "#a16207", "Aguardando Produção Sob Medida": "#ca8a04",
    "Análise PCP": "#4338ca", "Buscar em Loja": "#0891b2", "Análise Produção": "#7e22ce",
    "Bordado Interno e Externo": "#9333ea",
    "Pendência Comercial": "#6d28d9", "Aguardando Outro Pedido": "#1d4ed8",
    "Em Separação": "#3b82f6", "Conferência Separação": "#0369a1",
    "Conferência e Direcionamento": "#059669", "Programação": "#f59e0b",
    "Amostra Digital": "#8b5cf6", "Aprovação de Amostra Digital": "#7c3aed",
    "Amostra Física": "#be185d", "Aprovação de Amostra Física": "#9d174d",
    "Bordado Interno": "#10b981", "Bordado Externo": "#6d28d9",
    "Bordado Interno e Externo": "#0d9488", "Expedição": "#14b8a6",
    "Análise de Frete": "#06b6d4",
  };

  // Dias ÚTEIS parado na etapa (fim de semana não conta). Um pedido que entrou
  // na sexta não pode aparecer com 3 dias parado na segunda.
  const diasParado = (p) => {
    if (!p.etapaAt) return null;
    return diasUteisDesde(p.etapaAt);
  };

  // Formata prazo
  // O prazo é um DIA inteiro, não um instante. Contar pelo relógio fazia o
  // pedido que vence hoje aparecer como "Vencido 1d" desde a véspera.
  const fmtPrazo = (venc) => {
    const fim = fimDoDiaVenc(venc);
    if (fim == null) return "—";
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const dias = Math.round((fim - 86399999 - hoje.getTime()) / 86400000);
    if (dias < 0) return `Vencido ${Math.abs(dias)}d`;
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    if (dias < 7) return `${dias} dias`;
    return fmtVenc(venc, true);
  };

  return (
    <div style={{padding:0}}>
      <div style={{padding:"20px 32px",background:C.white,borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
        <div>
          <h2 style={{...F.title,fontSize:22,fontWeight:800,color:C.black,letterSpacing:"-0.01em"}}>Painel Pós-Venda</h2>
          <div style={{...F.body,fontSize:13,color:C.gray500,marginTop:2}}>Gestão de carteira e status dos pedidos ativos</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={carregar} disabled={loading} style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:6,padding:"7px 12px",cursor:loading?"wait":"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:600,fontSize:12,...F.body}}>
            <Ic n="refresh" s={13} c={C.gray700}/> {loading?"Carregando...":"Atualizar"}
          </button>
        <button onClick={()=>{
          const cols = ["Pedido","Vendas ID","Cliente","CNPJ","Vendedor","Valor","Etapa","Dias Parado","Entrada Etapa","Vencimento","Status","Contato Cliente"];
          const linhas = filtrados.map(p=>{
            const dias = p.etapaAt ? diasUteisDesde(p.etapaAt) : "";   // dias ÚTEIS
            const status = p.atrasado ? "Atrasado" : p.risco ? "Em risco" : "No prazo";
            const contato = p.aguardandoOutro ? "Aguardando outro pedido" : p.aguardandoCliente ? "Aguardando cliente" : p.emPendencia ? "Pendência comercial" : "";
            return [p.pedidoLinx||"",p.vendasId||"",p.client||"",p.cnpj||"",p.vendedor||"",
              (p.valor||0).toFixed(2).replace(".",","),
              p.etapa||"", dias,
              p.etapaAt?new Date(p.etapaAt).toLocaleString("pt-BR"):"",
              p.dataVencimento?fmtVenc(p.dataVencimento):"",
              status, contato];
          });
          const csv = "\uFEFF" + [cols, ...linhas].map(row =>
            row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(";")
          ).join("\n");
          const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `painel-posvenda_${new Date().toISOString().slice(0,10)}.csv`;
          a.click();
          URL.revokeObjectURL(a.href);
        }} style={{background:C.green,border:"none",color:C.white,borderRadius:6,padding:"7px 14px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,fontWeight:700,fontSize:12,...F.body,marginLeft:8}}>
          <Ic n="download" s={13} c={C.white}/> Exportar CSV
        </button>
        </div>
      </div>

      {erro && <div style={{margin:"16px 32px",padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {erro}</div>}

      {/* KPIs clicáveis */}
      <div style={{padding:"16px 32px",background:C.white,borderBottom:`1px solid ${C.gray200}`}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          <KpiCard label="Ativos" value={k.totalAtivos} sub={`R$ ${(k.valorTotalAtendimento/1000).toFixed(1)}k`} color="#4b5563" active={filtroChip==="todos"} onClick={()=>setFiltroChip("todos")}/>
          <KpiCard label="Atrasados" value={k.atrasados} sub="Ação urgente" color={C.red} active={filtroChip==="atrasados"} onClick={()=>setFiltroChip("atrasados")}/>
          <KpiCard label="Em Risco" value={k.emRisco} sub="Vencem em ≤ 48h" color="#d97706" active={filtroChip==="risco"} onClick={()=>setFiltroChip("risco")}/>
          <KpiCard label="Vencem Hoje" value={k.vencemHoje} sub="Prazo do dia" color="#ea580c" active={filtroChip==="vencem_hoje"} onClick={()=>setFiltroChip("vencem_hoje")}/>
          <KpiCard label="Pendência Comercial" value={k.emPendencia} sub="Ação interna" color="#7c3aed" active={filtroChip==="pendencia"} onClick={()=>setFiltroChip("pendencia")}/>
          <KpiCard label="Aguardando Cliente" value={k.aguardandoCliente} sub="Aprovação amostra" color="#0891b2" active={filtroChip==="aguardando"} onClick={()=>setFiltroChip("aguardando")}/>
          <KpiCard label="Aguardando Outro Pedido" value={k.aguardandoOutroPedido} sub="Faturar/enviar junto" color="#1d4ed8" active={filtroChip==="aguardando_outro"} onClick={()=>setFiltroChip("aguardando_outro")}/>
          <KpiCard label="Faturados Hoje" value={kpis.faturadosHoje||0} sub={`R$ ${((kpis.valorFaturadosHoje||0)/1000).toFixed(1)}k · geral`} color={C.green}/>
        </div>
      </div>

      {/* Distribuição por etapa */}
      <div style={{padding:"14px 32px",background:C.white,borderBottom:`1px solid ${C.gray200}`}}>
        <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Distribuição por etapa</div>
        <div style={{display:"flex",height:32,borderRadius:6,overflow:"hidden",border:`1px solid ${C.gray200}`}}>
          {Object.entries(dist).map(([etapa,count])=>{
            const total = Object.values(dist).reduce((s,n)=>s+n,0);
            if (!total) return null;
            const pct = (count/total)*100;
            return (
              <div key={etapa}
                onClick={()=>setFiltroEtapa(filtroEtapa===etapa?"":etapa)}
                title={`${etapa}: ${count} pedidos`}
                style={{width:`${pct}%`,background:corEtapa[etapa]||C.gray400,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:11,fontWeight:700,...F.body,cursor:"pointer",transition:"opacity 0.15s",opacity:filtroEtapa && filtroEtapa!==etapa?0.4:1}}>
                {pct>4?count:""}
              </div>
            );
          })}
        </div>
        {filtroEtapa && <div style={{marginTop:8,...F.body,fontSize:11,color:C.gray600}}>
          Filtrado por: <strong>{filtroEtapa}</strong> · <span onClick={()=>setFiltroEtapa("")} style={{color:C.red,cursor:"pointer",fontWeight:600}}>limpar</span>
        </div>}
      </div>

      {/* Alerta */}
      {k.vencemHoje > 0 && filtroChip !== "vencem_hoje" && <div style={{margin:"14px 32px",padding:"12px 16px",background:"#fef3c7",border:"1px solid #fcd34d",borderLeft:"4px solid #f59e0b",borderRadius:8,display:"flex",alignItems:"center",gap:12,...F.body,fontSize:13,color:"#92400e"}}>
        <span style={{fontSize:18}}>⚠️</span>
        <div style={{flex:1}}>
          <strong>{k.vencemHoje} pedido{k.vencemHoje!==1?"s":""}</strong> {k.vencemHoje!==1?"vencem":"vence"} hoje
        </div>
        <button onClick={()=>setFiltroChip("vencem_hoje")} style={{padding:"6px 12px",background:"#f59e0b",color:C.white,border:"none",borderRadius:5,fontSize:12,fontWeight:600,cursor:"pointer",...F.body}}>Ver</button>
      </div>}

      {/* Filtros */}
      <div style={{padding:"12px 32px",background:C.gray50,borderBottom:`1px solid ${C.gray200}`,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,maxWidth:340}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.gray400}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido Linx, nº HubSpot ou CNPJ..."
            style={{width:"100%",padding:"8px 12px 8px 34px",fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,outline:"none",background:C.white,...F.body,boxSizing:"border-box"}}/>
        </div>
        <select value={filtroEtapa} onChange={e=>setFiltroEtapa(e.target.value)} style={{padding:"8px 12px",fontSize:12,border:`1.5px solid ${C.gray200}`,background:C.white,borderRadius:6,color:C.gray700,cursor:"pointer",...F.body}}>
          <option value="">Todas as etapas</option>
          {Object.keys(dist).sort().map(e=><option key={e} value={e}>{e} ({dist[e]})</option>)}
        </select>
        <select value={filtroRespPV} onChange={e=>setFiltroRespPV(e.target.value)} style={{padding:"8px 12px",fontSize:12,border:`1.5px solid ${filtroRespPV?"#7c3aed":C.gray200}`,background:C.white,borderRadius:6,color:filtroRespPV?"#7c3aed":C.gray700,cursor:"pointer",...F.body,fontWeight:filtroRespPV?600:400}}>
          <option value="">Todos resp. pós-venda</option>
          {(rpv.responsaveis||[]).map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        <div style={{position:"relative"}}>
          <button onClick={()=>setVendedorDropdownAberto(v=>!v)}
            style={{padding:"8px 12px",fontSize:12,border:`1.5px solid ${filtroVendedores.length?C.red:C.gray200}`,background:C.white,borderRadius:6,color:filtroVendedores.length?C.red:C.gray700,cursor:"pointer",...F.body,display:"inline-flex",alignItems:"center",gap:6,fontWeight:filtroVendedores.length?600:400}}>
            {filtroVendedores.length===0 ? "Todos vendedores"
              : filtroVendedores.length===1 ? filtroVendedores[0]
              : `${filtroVendedores.length} vendedores`}
            <span style={{fontSize:10,marginLeft:2}}>▾</span>
          </button>
          {vendedorDropdownAberto && <>
            <div onClick={()=>setVendedorDropdownAberto(false)} style={{position:"fixed",inset:0,zIndex:19}}/>
            <div style={{position:"absolute",top:"100%",left:0,marginTop:4,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,0.08)",zIndex:20,minWidth:220,maxHeight:340,overflowY:"auto"}}>
              <div style={{padding:"8px 12px",borderBottom:`1px solid ${C.gray100}`,display:"flex",justifyContent:"space-between",gap:8}}>
                <span onClick={()=>setFiltroVendedores(vendedores)} style={{...F.body,fontSize:11,color:C.red,cursor:"pointer",fontWeight:600}}>Todos</span>
                <span onClick={()=>setFiltroVendedores([])} style={{...F.body,fontSize:11,color:C.gray600,cursor:"pointer",fontWeight:600}}>Limpar</span>
              </div>
              {vendedores.map(v => {
                const checked = filtroVendedores.includes(v);
                return (
                  <div key={v} onClick={()=>{
                    setFiltroVendedores(prev => checked ? prev.filter(x=>x!==v) : [...prev, v]);
                  }} style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${C.gray50}`}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <input type="checkbox" checked={checked} readOnly style={{cursor:"pointer",accentColor:C.red}}/>
                    <span style={{...F.body,fontSize:12,color:C.gray700}}>{v}</span>
                  </div>
                );
              })}
              {vendedores.length===0 && <div style={{padding:"12px",...F.body,fontSize:12,color:C.gray400,textAlign:"center"}}>Nenhum vendedor</div>}
            </div>
          </>}
        </div>
        <span style={{marginLeft:"auto",...F.body,fontSize:11,color:C.gray500}}>Mostrando <strong style={{color:C.black}}>{filtrados.length}</strong> de {pedidos.length}</span>
      </div>

      {/* Tabela */}
      <div style={{padding:"0 32px 24px",overflowX:"auto"}}>
        <div style={{background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`,marginTop:16,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,minWidth:1000}}>
            <thead>
              <tr>
                {["Pedido","Cliente","Vendedor","Valor","Etapa","Dias parado","Vencimento","Status","Ações"].map(h=>
                  <th key={h} style={{background:C.gray50,padding:"11px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${C.gray200}`,...F.body,position:"sticky",top:0,zIndex:1}}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtrados.length===0 && <tr><td colSpan={9} style={{padding:"32px",textAlign:"center",color:C.gray400,...F.body,fontSize:13}}>Nenhum pedido corresponde aos filtros.</td></tr>}
              {filtrados.map(p=>{
                const dias = diasParado(p);
                const critico = p.atrasado;
                const risco = p.risco && !p.atrasado;
                return (
                  <tr key={p.id}
                    onClick={()=>setSelecionado(p)}
                    style={{background:critico?"#fef2f2":"transparent",cursor:"pointer",borderBottom:`1px solid ${C.gray100}`}}
                    onMouseEnter={e=>{e.currentTarget.style.background=critico?"#fee2e2":"#fef7f6";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=critico?"#fef2f2":"transparent";}}>
                    <td style={{padding:"11px 12px",fontSize:12,...F.body}}>
                      <div style={{fontWeight:700,color:C.black,fontSize:13}}>PED {p.pedidoLinx||"—"}</div>
                      <div style={{color:C.gray400,fontSize:10}}>{p.vendasId}</div>
                    </td>
                    <td style={{padding:"11px 12px",fontSize:12,...F.body}}>
                      <div style={{fontWeight:600,color:C.black,fontSize:12}}>{p.client||"—"}</div>
                      <div style={{color:C.gray500,fontSize:10}}>{p.cnpj||""}</div>
                    </td>
                    <td style={{padding:"11px 12px",fontSize:12,color:C.gray600,...F.body}}>{p.vendedor||"—"}</td>
                    <td style={{padding:"11px 12px",fontSize:13,fontWeight:700,color:C.black,...F.body}}>{fmtR(p.valor)}</td>
                    <td style={{padding:"11px 12px"}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700,background:(corEtapa[p.etapa]||C.gray400)+"20",color:corEtapa[p.etapa]||C.gray600,...F.body,whiteSpace:"nowrap"}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:corEtapa[p.etapa]||C.gray400}}/>{p.etapa}
                      </span>
                      {/* Retido por falta de pagamento: o Pós-Venda precisa
                          cobrar o cliente pra o pedido voltar a andar. */}
                      {/* Usa etapasAtivas: se o pedido tem bordado ativo, a etapa
                          principal pode ser a do bordado e o selo sumia justamente
                          no pedido que precisa de cobrança. */}
                      {((p.etapasAtivas&&p.etapasAtivas.length?p.etapasAtivas:[p.etapa]).includes("Pendente Pagamento"))&&
                        <span title="Pedido embalado, mas o faturamento não foi liberado — cobrar o cliente"
                          style={{display:"inline-flex",alignItems:"center",gap:4,marginLeft:6,padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:800,background:"#be123c",color:C.white,...F.body,whiteSpace:"nowrap"}}>
                          COBRAR CLIENTE
                        </span>}
                    </td>
                    <td style={{padding:"11px 12px",fontSize:11,...F.body}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:4,fontWeight:700,background:dias>=4?"#fee2e2":dias>=2?"#fef3c7":C.gray100,color:dias>=4?"#991b1b":dias>=2?"#92400e":C.gray600}}>
                        {dias>=4?"🔴":dias>=2?"⚠":""} {dias===0?"hoje":dias===1?"1 dia":`${dias||0} dias`}
                      </span>
                    </td>
                    <td style={{padding:"11px 12px",fontSize:12,color:C.gray600,...F.body}}>{fmtPrazo(p.dataVencimento)}</td>
                    <td style={{padding:"11px 12px",fontSize:11,fontWeight:700,...F.body}}>
                      {p.atrasado ? <span style={{color:C.red}}>● Atrasado</span>
                        : risco ? <span style={{color:"#d97706"}}>● Em risco</span>
                        : <span style={{color:C.green}}>● No prazo</span>}
                    </td>
                    <td style={{padding:"11px 12px"}} onClick={e=>e.stopPropagation()}>
                      <div style={{display:"flex",gap:4}}>
                        <button title="Ver detalhes" onClick={()=>{onOpen(p);}}
                          style={{width:28,height:28,borderRadius:5,background:C.gray100,border:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.gray600}}>
                          <Ic n="pin" s={14} c={C.gray600}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selecionado && <PainelDetalhePedido pedido={selecionado} onClose={()=>setSelecionado(null)} onAbrirDetalhe={()=>{onOpen(selecionado); setSelecionado(null);}} user={user}/>}
    </div>
  );
}

// KPI Card clicável
function KpiCard({label, value, sub, color, active, onClick}) {
  return (
    <div onClick={onClick}
      style={{
        background:C.white, border:`1px solid ${active?color:C.gray200}`,
        borderLeft:`3px solid ${color}`,
        borderRadius:8, padding:"12px 14px", cursor:onClick?"pointer":"default",
        boxShadow:active?`0 0 0 3px ${color}22`:"none",
        transition:"all 0.15s",
      }}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.borderColor=color;}}
      onMouseLeave={e=>{if(onClick)e.currentTarget.style.borderColor=active?color:C.gray200;}}
    >
      <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
      <div style={{...F.title,fontSize:22,fontWeight:800,color,lineHeight:1,marginTop:4}}>{value}</div>
      {sub && <div style={{...F.body,fontSize:10,color:C.gray400,marginTop:2}}>{sub}</div>}
    </div>
  );
}

// Painel lateral de detalhes
function PainelDetalhePedido({pedido, onClose, onAbrirDetalhe, user}) {
  const [nota, setNota] = useState("");
  const [enviando, setEnviando] = useState(false);
  const enviarNota = async () => {
    if (!nota.trim()) return;
    setEnviando(true);
    try {
      const r = await apiFetch("/painel-posvenda/nota/" + pedido.posvendaId, "POST", {
        texto: nota.trim(),
        ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if (r.success) { setNota(""); alert("Nota registrada no timeline do pedido."); }
      else alert("Erro: " + (r.error||"desconhecido"));
    } catch (e) { alert("Erro: " + e.message); }
    setEnviando(false);
  };
  const telefone = ""; // TODO: buscar do card completo
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.15)",zIndex:9}}/>
      <div style={{position:"fixed",right:0,top:0,width:420,maxWidth:"90vw",height:"100vh",background:C.white,borderLeft:`1px solid ${C.gray200}`,boxShadow:"-8px 0 24px rgba(0,0,0,0.06)",zIndex:10,overflowY:"auto"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{...F.title,fontSize:15,fontWeight:700}}>PED {pedido.pedidoLinx||"—"}</div>
            <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>{pedido.client}</div>
          </div>
          <div onClick={onClose} style={{cursor:"pointer",color:C.gray500,padding:6}}>
            <Ic n="close" s={16} c={C.gray500}/>
          </div>
        </div>

        <div style={{padding:"16px 20px"}}>
          <div style={{marginBottom:20}}>
            <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Dados do pedido</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
              <InfoBox label="Cliente" value={pedido.client}/>
              <InfoBox label="CNPJ" value={pedido.cnpj}/>
              <InfoBox label="Valor" value={fmtR(pedido.valor)}/>
              <InfoBox label="Vendedor" value={pedido.vendedor}/>
              <InfoBox label="Etapa" value={pedido.etapa} highlight/>
              <InfoBox label="Vencimento" value={pedido.dataVencimento?fmtVenc(pedido.dataVencimento):"—"} color={pedido.atrasado?C.red:pedido.risco?"#d97706":C.green}/>
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Ações</div>
            <button onClick={onAbrirDetalhe} style={{width:"100%",padding:"10px 12px",background:C.red,color:C.white,border:"none",borderRadius:6,marginBottom:6,fontSize:12,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,...F.body}}>
              <Ic n="pin" s={14} c={C.white}/> Abrir pedido completo
            </button>
          </div>

          <div>
            <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Adicionar nota interna</div>
            <textarea value={nota} onChange={e=>setNota(e.target.value)} rows={3}
              placeholder="Ex: Cliente informou que amostra digital ficou boa, aguardando confirmação por email..."
              style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",resize:"vertical",marginBottom:8}}/>
            <button onClick={enviarNota} disabled={!nota.trim()||enviando}
              style={{width:"100%",padding:"10px 12px",background:!nota.trim()||enviando?C.gray200:"#0369a1",color:!nota.trim()||enviando?C.gray500:C.white,border:"none",borderRadius:6,fontSize:12,fontWeight:700,cursor:!nota.trim()||enviando?"not-allowed":"pointer",...F.body}}>
              {enviando?"Salvando...":"Registrar nota no timeline"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoBox({label, value, highlight, color}) {
  return (
    <div style={{padding:"8px 10px",background:C.gray50,borderRadius:5}}>
      <div style={{...F.body,fontSize:9,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:2}}>{label}</div>
      <div style={{...F.body,fontSize:12,fontWeight:highlight?700:600,color:color||C.black}}>{value||"—"}</div>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// BANCO DE IMAGENS
// Pesquisa cliente → lista pedidos → galeria de arquivos com preview lazy.
// ═════════════════════════════════════════════════════════════════════════════
function BancoImagens({user}) {
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [produtosCliente, setProdutosCliente] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(""); // sku ou "" pra todos
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [arquivos, setArquivos] = useState({}); // fileId → { fileName, tamanho, url, ehImagem }
  const searchTimeoutRef = useRef(null);

  // Debounce busca (200ms — mais rápido)
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (busca.trim().length < 2) { setClientes([]); setBuscando(false); return; }
    // Se o texto atual é exatamente o nome do cliente selecionado, não redispara
    // a busca (evita reabrir dropdown depois de selecionar).
    if (clienteSelecionado && busca.trim() === clienteSelecionado.razaoSocial.trim()) {
      setClientes([]);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    searchTimeoutRef.current = setTimeout(() => {
      apiFetch("/banco-imagens/buscar-clientes?q=" + encodeURIComponent(busca.trim()))
        .then(r => {
          if (r.success) setClientes(r.clientes||[]);
        })
        .finally(() => setBuscando(false));
    }, 200);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [busca, clienteSelecionado]);

  const selecionarCliente = (c) => {
    setClienteSelecionado(c);
    setClientes([]);
    setBusca(c.razaoSocial);
    setPedidoSelecionado(null);
    setProdutoSelecionado("");
    setLoading(true);
    const params = c.cnpj ? "cnpj="+encodeURIComponent(c.cnpj) : "razao="+encodeURIComponent(c.razaoSocial);
    apiFetch("/banco-imagens/pedidos-cliente?" + params)
      .then(r => {
        if (r.success) {
          setPedidos(r.pedidos||[]);
          setProdutosCliente(r.produtos||[]);
          if (r.pedidos?.length > 0) setPedidoSelecionado(r.pedidos[0]);
        }
      })
      .finally(() => setLoading(false));
  };

  // Carrega metadados dos arquivos do pedido selecionado
  useEffect(() => {
    if (!pedidoSelecionado) return;
    const idsNaoCarregados = pedidoSelecionado.arquivos
      .map(a => a.fileId)
      .filter(id => !arquivos[id]);
    if (!idsNaoCarregados.length) return;

    // Batch de 20 em 20
    const chunks = [];
    for (let i = 0; i < idsNaoCarregados.length; i += 20) {
      chunks.push(idsNaoCarregados.slice(i, i+20));
    }
    Promise.all(chunks.map(chunk =>
      apiFetch("/banco-imagens/file-batch?ids=" + chunk.join(","))
    )).then(results => {
      const novo = {...arquivos};
      for (const r of results) {
        for (const f of (r.files||[])) {
          novo[f.fileId] = f;
        }
      }
      setArquivos(novo);
    });
  }, [pedidoSelecionado]);

  // Filtra pedidos por produto selecionado
  const pedidosFiltrados = produtoSelecionado
    ? pedidos.filter(p => (p.produtos||[]).some(prod => (prod.sku||prod.nome) === produtoSelecionado))
    : pedidos;

  // Se pedido selecionado foi filtrado fora, seleciona o primeiro
  useEffect(() => {
    if (produtoSelecionado && pedidoSelecionado) {
      if (!pedidosFiltrados.find(p => p.dealId === pedidoSelecionado.dealId)) {
        setPedidoSelecionado(pedidosFiltrados[0] || null);
      }
    }
  }, [produtoSelecionado]);

  // Filtra arquivos por tipo E por produto (matching no nome do arquivo pelo SKU)
  const filtrarArquivos = (lista) => {
    let out = lista;
    if (filtroTipo !== "todos") out = out.filter(a => a.tipo === filtroTipo);
    if (produtoSelecionado) {
      const sku = produtoSelecionado.trim();
      out = out.filter(a => {
        const meta = arquivos[a.fileId];
        const nome = (meta?.fileName || "").toLowerCase();
        return nome.includes(sku.toLowerCase());
      });
    }
    return out;
  };

  // Conta por tipo
  const contagem = { programacao:0, amostra_digital:0, amostra_fisica:0, bordado:0, dtf_silk:0 };
  const arquivosDoPedido = pedidoSelecionado?.arquivos || [];
  for (const a of arquivosDoPedido) contagem[a.tipo] = (contagem[a.tipo]||0) + 1;

  const TIPOS = [
    { key: "todos",           label: "Todos",           cor: "#4b5563" },
    { key: "programacao",     label: "Programação",     cor: "#f59e0b" },
    { key: "amostra_digital", label: "Amostra Digital", cor: "#8b5cf6" },
    { key: "amostra_fisica",  label: "Amostra Física",  cor: "#be185d" },
    { key: "bordado",         label: "Arquivos Bordado",cor: "#ef4444" },
    { key: "dtf_silk",        label: "DTF / Silk",      cor: "#0891b2" },
  ];

  const arquivosFiltrados = filtrarArquivos(arquivosDoPedido);
  const totalTodos = arquivosDoPedido.length;

  return (
    <div style={{padding:0,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"20px 32px 12px",background:C.white,borderBottom:`1px solid ${C.gray200}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
          <div>
            <h2 style={{...F.title,fontSize:22,fontWeight:800,color:C.black}}>Banco de Imagens</h2>
            <div style={{...F.body,fontSize:13,color:C.gray500,marginTop:2}}>Arquivos históricos de pedidos por cliente</div>
          </div>
        </div>
        <div style={{position:"relative",maxWidth:560}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.gray400}}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <input value={busca} onChange={e=>{setBusca(e.target.value);if(clienteSelecionado)setClienteSelecionado(null);}}
            placeholder="Buscar por Razão Social ou CNPJ..."
            style={{width:"100%",padding:"12px 16px 12px 44px",fontSize:14,border:`1.5px solid ${C.gray200}`,borderRadius:8,outline:"none",background:C.gray50,...F.body,boxSizing:"border-box"}}/>
          {(buscando || clientes.length>0) && <div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:6,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,0.08)",zIndex:5,maxHeight:400,overflowY:"auto"}}>
            {buscando && <div style={{padding:"12px 16px",...F.body,fontSize:13,color:C.gray500}}>Buscando...</div>}
            {!buscando && clientes.length===0 && <div style={{padding:"12px 16px",...F.body,fontSize:13,color:C.gray500}}>Nenhum cliente encontrado.</div>}
            {clientes.map((c,i) => (
              <div key={i} onClick={()=>selecionarCliente(c)} style={{padding:"10px 16px",borderBottom:i===clientes.length-1?"none":`1px solid ${C.gray100}`,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{...F.body,fontSize:13,fontWeight:600,color:C.black}}>{c.razaoSocial||"—"}</div>
                <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>
                  {c.cnpj||"sem CNPJ"} · {c.totalPedidos} pedido{c.totalPedidos!==1?"s":""}
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>

      {clienteSelecionado && <>
        {/* Filtros de tipo + produto */}
        <div style={{padding:"12px 32px",background:C.gray50,borderBottom:`1px solid ${C.gray200}`,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {produtosCliente.length > 0 && <>
            <span style={{...F.body,fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em"}}>PRODUTO:</span>
            <select value={produtoSelecionado} onChange={e=>setProdutoSelecionado(e.target.value)}
              style={{padding:"6px 12px",fontSize:12,border:`1.5px solid ${C.gray200}`,background:C.white,borderRadius:6,color:C.gray700,cursor:"pointer",...F.body,maxWidth:340,marginRight:12}}>
              <option value="">Todos os produtos ({produtosCliente.length})</option>
              {produtosCliente.map((p,i) => (
                <option key={i} value={p.sku||p.nome}>
                  {p.nome || p.sku}
                </option>
              ))}
            </select>
          </>}
          <span style={{...F.body,fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em"}}>TIPO:</span>
          {TIPOS.map(t => {
            const count = t.key === "todos" ? totalTodos : (contagem[t.key]||0);
            return (
              <span key={t.key} onClick={()=>setFiltroTipo(t.key)}
                style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,background:filtroTipo===t.key?t.cor:C.white,color:filtroTipo===t.key?C.white:t.cor,border:`1.5px solid ${filtroTipo===t.key?t.cor:C.gray200}`,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,...F.body,transition:"all 0.15s"}}>
                {t.label} <span style={{background:filtroTipo===t.key?"rgba(255,255,255,0.25)":C.gray100,color:filtroTipo===t.key?C.white:C.gray600,padding:"1px 7px",borderRadius:10,fontSize:10,fontWeight:700}}>{count}</span>
              </span>
            );
          })}
        </div>

        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {/* Coluna pedidos */}
          <div style={{width:320,background:C.white,borderRight:`1px solid ${C.gray200}`,overflowY:"auto"}}>
            <div style={{padding:"14px 20px",background:"#f0f9ff",borderLeft:"3px solid #0369a1",borderBottom:`1px solid ${C.gray100}`}}>
              <div style={{...F.body,fontSize:14,fontWeight:700,color:C.black}}>{clienteSelecionado.razaoSocial}</div>
              <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>CNPJ: {clienteSelecionado.cnpj||"—"}</div>
              <div style={{...F.body,fontSize:11,color:"#0369a1",fontWeight:700,marginTop:6}}>
                📁 {pedidosFiltrados.length} pedido{pedidosFiltrados.length!==1?"s":""}{produtoSelecionado?" com esse produto":""} · {pedidosFiltrados.reduce((s,p)=>s+p.totalArquivos,0)} arquivos
              </div>
            </div>
            <div style={{padding:"14px 20px 10px",fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:`1px solid ${C.gray200}`,position:"sticky",top:0,background:C.white,zIndex:1,display:"flex",justifyContent:"space-between",...F.body}}>
              <span>PEDIDOS</span>
              <span style={{textTransform:"none",fontWeight:500,color:C.gray400,letterSpacing:0}}>mais recente ▼</span>
            </div>
            {loading && <div style={{padding:20,textAlign:"center",color:C.gray400,...F.body,fontSize:12}}>Carregando pedidos...</div>}
            {!loading && pedidosFiltrados.length===0 && <div style={{padding:20,textAlign:"center",color:C.gray400,...F.body,fontSize:12}}>
              {produtoSelecionado?"Nenhum pedido com esse produto.":"Nenhum pedido com arquivos encontrado."}
            </div>}
            {pedidosFiltrados.map(p => (
              <div key={p.dealId} onClick={()=>setPedidoSelecionado(p)}
                style={{padding:"12px 20px",borderBottom:`1px solid ${C.gray100}`,cursor:"pointer",background:pedidoSelecionado?.dealId===p.dealId?"#C6282808":"transparent",borderLeft:pedidoSelecionado?.dealId===p.dealId?"3px solid "+C.red:"3px solid transparent",paddingLeft:pedidoSelecionado?.dealId===p.dealId?17:20}}>
                <div style={{...F.body,fontSize:13,fontWeight:700,color:C.black}}>
                  PED {p.pedidoLinx||"—"} <span style={{color:C.gray400,fontWeight:400}}>({p.vendasId})</span>
                </div>
                <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>
                  {new Date(p.data).toLocaleDateString("pt-BR")} · {fmtR(p.valor)}
                </div>
                <div style={{...F.body,fontSize:10,color:C.gray500,marginTop:6,display:"flex",alignItems:"center",gap:4}}>
                  📎 <strong style={{color:C.black}}>{p.totalArquivos}</strong> arquivo{p.totalArquivos!==1?"s":""}
                </div>
              </div>
            ))}
          </div>

          {/* Coluna galeria */}
          <div style={{flex:1,overflowY:"auto",padding:"20px 32px"}}>
            {!pedidoSelecionado && <div style={{textAlign:"center",padding:80,color:C.gray400}}>
              <div style={{fontSize:60,opacity:0.3,marginBottom:16}}>📁</div>
              <div style={{...F.body,fontSize:16,fontWeight:700,color:C.gray500}}>Selecione um pedido</div>
              <div style={{...F.body,fontSize:13,marginTop:6}}>Escolha um pedido à esquerda pra ver os arquivos</div>
            </div>}

            {pedidoSelecionado && <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{...F.title,fontSize:16,fontWeight:700,color:C.black}}>
                  PED {pedidoSelecionado.pedidoLinx||"—"} — {new Date(pedidoSelecionado.data).toLocaleDateString("pt-BR")}
                </h3>
                <span style={{...F.body,fontSize:12,color:C.gray500}}>
                  {arquivosFiltrados.length} arquivo{arquivosFiltrados.length!==1?"s":""}
                </span>
              </div>

              {arquivosFiltrados.length===0 && <div style={{padding:40,textAlign:"center",color:C.gray400,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`,...F.body,fontSize:13}}>
                Nenhum arquivo desse tipo no pedido.
              </div>}

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16}}>
                {arquivosFiltrados.map((a,i) => {
                  const meta = arquivos[a.fileId];
                  const tipoObj = TIPOS.find(t => t.key === a.tipo);
                  const badgeCor = tipoObj?.cor || C.gray500;
                  const ehImagem = meta?.ehImagem;
                  return (
                    <div key={a.fileId+"-"+i} onClick={()=>{ if (meta?.url) window.open(meta.url, "_blank"); }}
                      style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden",cursor:meta?.url?"pointer":"default",transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.gray200;e.currentTarget.style.boxShadow="none";}}>
                      <div style={{width:"100%",aspectRatio:"1",background:ehImagem?C.gray100:tipoObj?.cor+"15","display":"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                        <span style={{position:"absolute",top:8,left:8,padding:"3px 8px",background:badgeCor,color:C.white,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",borderRadius:4,zIndex:2,...F.body}}>
                          {tipoObj?.label.slice(0,8).toUpperCase() || "ARQ"}
                        </span>
                        {ehImagem && meta?.url && <img loading="lazy" src={meta.url} alt=""
                          style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                        {!ehImagem && <span style={{fontSize:42,color:"rgba(0,0,0,0.35)"}}>{
                          meta?.extension==="pdf"?"📄":
                          meta?.extension==="dst"||meta?.extension==="emb"?"🧵":
                          "📎"
                        }</span>}
                        {!meta && <div style={{position:"absolute",inset:0,background:`linear-gradient(90deg, ${C.gray100} 25%, ${C.gray200} 50%, ${C.gray100} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite"}}/>}
                      </div>
                      <div style={{padding:"10px 12px",borderTop:`1px solid ${C.gray100}`}}>
                        <div style={{...F.body,fontSize:12,fontWeight:600,color:C.black,marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {meta?.fileName || "carregando..."}
                        </div>
                        <div style={{...F.body,fontSize:10,color:C.gray500,display:"flex",justifyContent:"space-between"}}>
                          <span>{meta?.extension?.toUpperCase() || "—"}</span>
                          <span>{meta?.tamanho ? (meta.tamanho/1024/1024).toFixed(1)+"MB" : ""}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>}
          </div>
        </div>
      </>}

      {!clienteSelecionado && <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.gray400}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:60,opacity:0.3,marginBottom:16}}>🔍</div>
          <div style={{...F.body,fontSize:16,fontWeight:700,color:C.gray500}}>Comece buscando um cliente</div>
          <div style={{...F.body,fontSize:13,marginTop:6,maxWidth:320}}>Digite pelo menos 2 caracteres da razão social ou do CNPJ</div>
        </div>
      </div>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CHAT DOS PEDIDOS
// Cada pedido (nº Linx) é uma conversa. Threads à esquerda com badge de não-lidas,
// conversa à direita. Notificação = badge global (polling em App). Mensagens no
// Supabase via worker (/chat/*).
// ═════════════════════════════════════════════════════════════════════════════
function fmtChatData(iso){
  if(!iso) return "";
  const d=new Date(iso); const hoje=new Date();
  const mesmodia=d.toDateString()===hoje.toDateString();
  return mesmodia
    ? d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})
    : d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
}
function ChatPage({user,usuarios,chatResumo,onResumo,pedidoInicial,onLimparInicial}){
  const [threads,setThreads]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [selCliente,setSelCliente]=useState("");
  const [msgs,setMsgs]=useState([]);
  const [texto,setTexto]=useState("");
  const [enviando,setEnviando]=useState(false);
  const [abrirId,setAbrirId]=useState("");
  const [aba,setAba]=useState("mencao");           // "mencao" | "sem"
  const [mm,setMm]=useState({open:false,opts:[]});  // dropdown de @menção
  const [mencSel,setMencSel]=useState({});          // firstNameLower -> email (escolhidos)
  const fimRef=useRef(null);
  const taRef=useRef(null);
  const meuEmail=(user?.email||"").toLowerCase();
  const firstName=(u)=>String(u?.nome||u?.name||"").trim().split(/\s+/)[0]||"";

  // Detecta @token no cursor e abre dropdown de usuários
  const onChangeTexto=(e)=>{
    const val=e.target.value; setTexto(val);
    const caret=e.target.selectionStart||val.length;
    const m=val.slice(0,caret).match(/@([\p{L}0-9._-]*)$/u);
    if(m){
      const q=m[1].toLowerCase();
      const opts=(usuarios||[]).filter(u=>{const n=String(u.nome||u.name||"").toLowerCase(); return n&&(q===""||n.includes(q));}).slice(0,6);
      setMm({open:opts.length>0,opts});
    } else setMm({open:false,opts:[]});
  };
  const escolherMenc=(u)=>{
    const first=firstName(u);
    const ta=taRef.current;
    const caret=ta?ta.selectionStart:texto.length;
    const antes=texto.slice(0,caret).replace(/@([\p{L}0-9._-]*)$/u,"@"+first+" ");
    setTexto(antes+texto.slice(caret));
    setMencSel(prev=>({...prev,[first.toLowerCase()]:String(u.email||"").toLowerCase()}));
    setMm({open:false,opts:[]});
    setTimeout(()=>{try{ta&&ta.focus();}catch(e){}},0);
  };
  // Resolve os e-mails mencionados a partir do texto (@Nome)
  const resolverMencoes=(txt)=>{
    const emails=new Set();
    for(const mt of String(txt).matchAll(/@([\p{L}0-9._-]+)/gu)){
      const tok=mt[1].toLowerCase();
      if(mencSel[tok]) emails.add(mencSel[tok]);
      else{ const u=(usuarios||[]).find(u=>firstName(u).toLowerCase()===tok); if(u&&u.email) emails.add(String(u.email).toLowerCase()); }
    }
    return Array.from(emails);
  };
  // Renderiza o texto destacando @menções
  const renderMsg=(txt)=>{
    const partes=String(txt||"").split(/(@[\p{L}0-9._-]+)/gu);
    return partes.map((p,i)=> p.startsWith("@")
      ? <strong key={i} style={{color:"inherit",fontWeight:800}}>{p}</strong>
      : <span key={i}>{p}</span>);
  };

  const carregarThreads=()=>{
    apiFetch("/chat/threads?email="+encodeURIComponent(meuEmail))
      .then(r=>{if(r&&r.success)setThreads(r.data||[]);})
      .catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{carregarThreads();const t=setInterval(carregarThreads,20000);return ()=>clearInterval(t);},[meuEmail]);

  const carregarMsgs=(pid)=>{
    apiFetch("/chat/"+encodeURIComponent(pid)).then(r=>{if(r&&r.success)setMsgs(r.data||[]);}).catch(()=>{});
  };
  const abrirThread=(pid,cliente)=>{
    if(!pid)return;
    setSel(String(pid)); setSelCliente(cliente||"");
    // Limpa antes de buscar: sem isso o cabeçalho já mostrava o pedido novo
    // enquanto o corpo ainda exibia as mensagens do anterior — e se a busca
    // falhasse, ficava assim indefinidamente (você lia e respondia achando
    // que estava na conversa certa).
    setMsgs([]);
    setMencSel({});
    carregarMsgs(String(pid));
    apiFetch("/chat/marcar-lido","POST",{email:meuEmail,pedidoId:String(pid)})
      .then(()=>{onResumo&&onResumo();carregarThreads();}).catch(()=>{});
  };

  useEffect(()=>{ if(pedidoInicial){abrirThread(String(pedidoInicial),"");onLimparInicial&&onLimparInicial();} },[pedidoInicial]);
  useEffect(()=>{ if(!sel)return; const t=setInterval(()=>carregarMsgs(sel),15000); return ()=>clearInterval(t); },[sel]);
  useEffect(()=>{ try{fimRef.current&&fimRef.current.scrollIntoView({behavior:"smooth"});}catch(e){} },[msgs]);

  const enviar=async()=>{
    const t=texto.trim(); if(!t||!sel)return;
    // Enter dispara direto e o campo só é limpo DEPOIS do await — dois Enter
    // rápidos (ou rede lenta) mandavam a mesma mensagem duas vezes.
    if(enviando)return;
    setEnviando(true);
    try{
      await apiFetch("/chat/"+encodeURIComponent(sel),"POST",{texto:t,autorNome:user.nome||user.name||user.email,autorEmail:meuEmail,cliente:selCliente,mencionados:resolverMencoes(t)});
      setTexto(""); setMencSel({}); setMm({open:false,opts:[]}); carregarMsgs(sel); carregarThreads(); onResumo&&onResumo();
    }catch(e){alert("Erro ao enviar: "+e.message);}
    finally{setEnviando(false);}
  };
  const threadsFiltradas=threads.filter(t=>aba==="mencao"?t.mencionouMe:!t.mencionouMe);
  const nMenc=threads.filter(t=>t.mencionouMe).length;
  const nSem=threads.length-nMenc;

  return(
    <div style={{display:"flex",height:"100%",background:C.gray100}}>
      {/* Lista de threads */}
      <div style={{width:320,flexShrink:0,borderRight:`1px solid ${C.gray200}`,background:C.white,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.gray200}`}}>
          <div style={{...F.title,fontSize:16,fontWeight:800,color:C.black,marginBottom:10}}>Conversas</div>
          <div style={{display:"flex",gap:6}}>
            <input value={abrirId} onChange={e=>setAbrirId(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){abrirThread(abrirId.trim(),"");setAbrirId("");}}}
              placeholder="Abrir pedido (nº Linx)…"
              style={{flex:1,padding:"8px 10px",border:`1.5px solid ${C.gray200}`,borderRadius:7,...F.body,fontSize:12,outline:"none"}}/>
            <button onClick={()=>{abrirThread(abrirId.trim(),"");setAbrirId("");}}
              style={{background:C.red,color:C.white,border:"none",borderRadius:7,padding:"0 12px",cursor:"pointer",fontWeight:700,...F.body,fontSize:12}}>Abrir</button>
          </div>
        </div>
        {/* Mini-abas */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.gray200}`}}>
          {[{k:"mencao",label:"Me mencionaram",n:nMenc},{k:"sem",label:"Sem menção",n:nSem}].map(tb=>{
            const on=aba===tb.k;
            return(
              <button key={tb.k} onClick={()=>setAba(tb.k)}
                style={{flex:1,padding:"10px 6px",background:"none",border:"none",borderBottom:on?`2px solid ${C.red}`:"2px solid transparent",cursor:"pointer",...F.body,fontSize:12,fontWeight:on?700:500,color:on?C.red:C.gray500,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5}}>
                {tb.label}
                {/* Antes a aba mostrava chatResumo.mencoes (nº de MENSAGENS) enquanto a
                    lista abaixo tinha threads — badge "7" com 2 conversas. Agora as
                    duas abas contam a mesma coisa: conversas. */}
                {false
                  ? <span style={{background:C.red,color:C.white,borderRadius:9,fontSize:9,fontWeight:800,padding:"1px 5px"}}>{chatResumo.mencoes}</span>
                  : <span style={{color:C.gray400,fontWeight:700}}>{tb.n}</span>}
              </button>
            );
          })}
        </div>
        <div className="sgp-scroll" style={{flex:1,overflowY:"auto"}}>
          {loading&&<div style={{padding:20,...F.body,fontSize:13,color:C.gray400}}>Carregando…</div>}
          {!loading&&threadsFiltradas.length===0&&<div style={{padding:20,...F.body,fontSize:13,color:C.gray400}}>{aba==="mencao"?"Nenhuma conversa em que te mencionaram.":"Nenhuma conversa sem menção. Abra um pedido pelo número acima pra começar."}</div>}
          {threadsFiltradas.map(t=>{
            const on=sel===String(t.pedidoId);
            return(
              <div key={t.pedidoId} onClick={()=>abrirThread(t.pedidoId,t.cliente)}
                style={{padding:"12px 16px",borderBottom:`1px solid ${C.gray100}`,cursor:"pointer",background:on?C.red+"0e":"transparent",borderLeft:on?`3px solid ${C.red}`:"3px solid transparent"}}
                onMouseEnter={e=>{if(!on)e.currentTarget.style.background=C.gray50;}}
                onMouseLeave={e=>{if(!on)e.currentTarget.style.background="transparent";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <span style={{...F.body,fontSize:13,fontWeight:700,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.cliente||("Pedido "+t.pedidoId)}</span>
                  {t.naoLidas>0&&<span style={{background:C.red,color:C.white,borderRadius:10,fontSize:10,fontWeight:800,padding:"2px 7px",...F.body}}>{t.naoLidas}</span>}
                </div>
                <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>#{t.pedidoId} · {fmtChatData(t.ultimoEm)}</div>
                <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.ultimoAutor?(t.ultimoAutor.split(" ")[0]+": "):""}{t.ultimaMsg}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Conversa */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {!sel&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",...F.body,color:C.gray400,fontSize:14}}>Selecione uma conversa ou abra um pedido pelo número.</div>}
        {sel&&<>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.gray200}`,background:C.white}}>
            <div style={{...F.title,fontSize:15,fontWeight:800,color:C.black}}>{selCliente||("Pedido "+sel)}</div>
            <div style={{...F.body,fontSize:12,color:C.gray500}}>Pedido #{sel}</div>
          </div>
          <div className="sgp-scroll" style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:8}}>
            {msgs.length===0&&<div style={{...F.body,fontSize:13,color:C.gray400,textAlign:"center",marginTop:20}}>Sem mensagens ainda. Seja o primeiro a escrever.</div>}
            {msgs.map(m=>{
              const meu=(m.autor_email||"").toLowerCase()===meuEmail;
              const mencMe=!meu&&(m.mencionados||"").toLowerCase().split(",").map(s=>s.trim()).includes(meuEmail);
              return(
                <div key={m.id} style={{alignSelf:meu?"flex-end":"flex-start",maxWidth:"72%"}}>
                  <div style={{background:meu?C.red:(mencMe?"#fffbeb":C.white),color:meu?C.white:C.black,border:meu?"none":`1px solid ${mencMe?"#f59e0b":C.gray200}`,borderLeft:mencMe?`3px solid #f59e0b`:undefined,borderRadius:12,padding:"8px 12px",...F.body,fontSize:13,lineHeight:1.4,wordBreak:"break-word",whiteSpace:"pre-wrap"}}>
                    {!meu&&<div style={{fontSize:11,fontWeight:800,color:C.red,marginBottom:2,display:"flex",alignItems:"center",gap:6}}>{m.autor_nome||m.autor_email}{mencMe&&<span style={{fontSize:9,fontWeight:800,color:"#b45309",background:"#fef3c7",borderRadius:5,padding:"1px 5px",letterSpacing:"0.03em"}}>MENCIONOU VOCÊ</span>}</div>}
                    {renderMsg(m.texto)}
                  </div>
                  <div style={{...F.body,fontSize:10,color:C.gray400,marginTop:2,textAlign:meu?"right":"left"}}>{fmtChatData(m.criado_em)}</div>
                </div>
              );
            })}
            <div ref={fimRef}/>
          </div>
          <div style={{padding:"12px 16px",borderTop:`1px solid ${C.gray200}`,background:C.white,display:"flex",gap:8,alignItems:"flex-end",position:"relative"}}>
            {/* Dropdown de @menção */}
            {mm.open&&mm.opts.length>0&&(
              <div style={{position:"absolute",bottom:"100%",left:16,marginBottom:6,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:10,boxShadow:"0 6px 20px rgba(0,0,0,0.12)",overflow:"hidden",zIndex:30,minWidth:200}}>
                <div style={{padding:"6px 12px",...F.body,fontSize:10,fontWeight:800,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:`1px solid ${C.gray100}`}}>Mencionar</div>
                {mm.opts.map(u=>(
                  <div key={u.email||u.nome} onClick={()=>escolherMenc(u)}
                    style={{padding:"8px 12px",cursor:"pointer",...F.body,fontSize:13,color:C.gray700,display:"flex",alignItems:"center",gap:8}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontWeight:700,color:C.red}}>@</span>{u.nome||u.name}
                  </div>
                ))}
              </div>
            )}
            <textarea ref={taRef} value={texto} onChange={onChangeTexto} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!mm.open){e.preventDefault();enviar();}if(e.key==="Escape")setMm({open:false,opts:[]});}}
              placeholder="Escreva uma mensagem…  Use @ para mencionar. (Enter envia)" rows={1}
              style={{flex:1,resize:"none",padding:"10px 12px",border:`1.5px solid ${C.gray200}`,borderRadius:10,...F.body,fontSize:13,outline:"none",maxHeight:120}}/>
            <button onClick={enviar} disabled={enviando||!texto.trim()}
              style={{background:texto.trim()?C.red:C.gray300,color:C.white,border:"none",borderRadius:10,padding:"10px 16px",cursor:texto.trim()?"pointer":"default",fontWeight:700,...F.body,fontSize:13,display:"inline-flex",alignItems:"center",gap:6}}>
              <Ic n="send" s={14} c={C.white}/> Enviar
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// RAIO-X DO SISTEMA (só admin)
// Painel de saúde: pedidos fora do SGP (deveriam estar), parados (SLA estourado +
// tempo fixo), mais atrasados, e atividade do chat. Reaproveita endpoints prontos.
// ═════════════════════════════════════════════════════════════════════════════
function RaioX({user,onOpen,slaCfg,onIrChat}){
  const [peds,setPeds]=useState(null);
  const [leaks,setLeaks]=useState(null);
  const [threads,setThreads]=useState([]);
  const [corte,setCorte]=useState(3);
  const [loading,setLoading]=useState(true);

  const carregar=async()=>{
    setLoading(true);
    try{ await apiFetch("/snapshot-aberto").catch(()=>null);
      const r=await apiFetch("/painel-posvenda"); setPeds(r&&r.success?(r.pedidos||[]):[]);
    }catch(e){ setPeds([]); }
    apiFetch("/admin/monitor-sem-posvenda?dias=30").then(r=>{setLeaks(r&&r.success?(r.leaks||[]):[]);}).catch(()=>setLeaks([]));
    apiFetch("/chat/threads?email="+encodeURIComponent(user?.email||"")).then(r=>{if(r&&r.success)setThreads(r.data||[]);}).catch(()=>{});
    setLoading(false);
  };
  useEffect(()=>{carregar();},[]);

  const diasParado=(p)=>p.etapaAt?diasUteisDesde(p.etapaAt):null;   // dias ÚTEIS (sem fim de semana)
  const lista=peds||[];
  const atrasados=lista.filter(p=>p.atrasado).sort((a,b)=>new Date(a.dataVencimento||0)-new Date(b.dataVencimento||0));
  const paradosTempo=lista.filter(p=>{const d=diasParado(p);return d!=null&&d>=corte;}).sort((a,b)=>(diasParado(b)||0)-(diasParado(a)||0));
  const totalChatNaoLidas=threads.reduce((s,t)=>s+(t.naoLidas||0),0);

  const Sec=({icon,cor,titulo,sub,count,children})=>(
    <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.gray100}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:8,background:cor+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={icon} s={18} c={cor}/></div>
        <div style={{flex:1}}>
          <div style={{...F.title,fontSize:14,fontWeight:800,color:C.black}}>{titulo}</div>
          {sub&&<div style={{...F.body,fontSize:11.5,color:C.gray500}}>{sub}</div>}
        </div>
        <div style={{...F.title,fontSize:20,fontWeight:800,color:count>0?cor:C.gray300}}>{count}</div>
      </div>
      <div style={{padding:count>0?"6px 0":"16px 18px"}}>{children}</div>
    </div>
  );
  const Linha=({children,onClick})=>(
    <div onClick={onClick} style={{padding:"9px 18px",borderBottom:`1px solid ${C.gray50}`,display:"flex",alignItems:"center",gap:10,cursor:onClick?"pointer":"default",...F.body,fontSize:12.5,color:C.gray700}}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.background=C.gray50;}}
      onMouseLeave={e=>{if(onClick)e.currentTarget.style.background="transparent";}}>{children}</div>
  );
  const btnChat=(pid)=>(
    <button onClick={(e)=>{e.stopPropagation();onIrChat&&onIrChat(String(pid));}}
      style={{background:C.white,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"4px 9px",cursor:"pointer",...F.body,fontSize:11,fontWeight:700,color:C.gray600,display:"inline-flex",alignItems:"center",gap:5,flexShrink:0}}>
      <Ic n="chat" s={12} c={C.gray500}/> Chat
    </button>
  );

  return(
    <div style={{padding:"20px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{...F.title,fontSize:22,fontWeight:800,color:C.black,letterSpacing:"-0.01em",margin:0}}>Raio-X do Sistema</h2>
          <div style={{...F.body,fontSize:13,color:C.gray500,marginTop:2}}>Visão de saúde da operação — o que precisa de atenção agora</div>
        </div>
        <button onClick={carregar} disabled={loading}
          style={{background:C.white,border:`1.5px solid ${C.gray300}`,borderRadius:7,padding:"8px 14px",cursor:loading?"wait":"pointer",...F.body,fontWeight:700,fontSize:12,color:C.gray700,display:"inline-flex",alignItems:"center",gap:6}}>
          <Ic n="refresh" s={13} c={C.gray700}/> {loading?"Carregando…":"Atualizar"}
        </button>
      </div>

      <Sec icon="warn" cor="#d97706" titulo="Pedidos fora do SGP (deveriam estar)"
        sub="Vendas fechadas (últimos 30 dias) sem pós-venda gerado, ignorando naturezas de remessa" count={(leaks||[]).length}>
        {leaks===null&&<div style={{...F.body,fontSize:12,color:C.gray400,padding:"6px 18px"}}>Verificando…</div>}
        {(leaks||[]).map(l=>(
          <Linha key={l.id}>
            <span style={{fontWeight:700,color:C.black,minWidth:70}}>#{l.linx||l.id}</span>
            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.razao}</span>
            <span style={{fontSize:11,color:C.gray500}}>{l.natureza}</span>
            <span style={{fontSize:11,color:C.gray400}}>{l.closedate}</span>
            {l.comBordado&&<span style={{fontSize:10,fontWeight:800,color:C.purple,background:C.purple+"14",borderRadius:5,padding:"2px 6px"}}>BORDADO</span>}
          </Linha>
        ))}
        {leaks&&leaks.length===0&&<div style={{...F.body,fontSize:12.5,color:C.green,padding:"2px 0"}}>✓ Nenhum pedido passando em branco.</div>}
      </Sec>

      <Sec icon="clock" cor={C.red} titulo="Mais atrasados (SLA estourado)"
        sub="Pedidos que já passaram do prazo de vencimento" count={atrasados.length}>
        {atrasados.slice(0,20).map(p=>(
          <Linha key={p.id||p.vendasId} onClick={()=>onOpen&&onOpen(p)}>
            <span style={{fontWeight:700,color:C.black,minWidth:70}}>#{p.pedidoLinx||p.vendasId}</span>
            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.client}</span>
            <span style={{fontSize:11,color:C.gray500}}>{p.etapa}</span>
            <span style={{fontSize:11,fontWeight:700,color:C.red}}>{p.dataVencimento?("venc "+fmtVenc(p.dataVencimento,true)):""}</span>
            {btnChat(p.vendasId||p.pedidoLinx)}
          </Linha>
        ))}
        {atrasados.length===0&&<div style={{...F.body,fontSize:12.5,color:C.green}}>✓ Nenhum pedido atrasado.</div>}
      </Sec>

      <Sec icon="activity" cor="#0891b2" titulo={"Parados há "+corte+"+ dias na mesma etapa"}
        sub="Tempo fixo na etapa atual, independente do SLA" count={paradosTempo.length}>
        <div style={{padding:"0 18px 8px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{...F.body,fontSize:11.5,color:C.gray500}}>Corte:</span>
          {[2,3,5,7].map(n=>(
            <button key={n} onClick={()=>setCorte(n)} style={{background:corte===n?"#0891b2":C.white,color:corte===n?C.white:C.gray600,border:`1.5px solid ${corte===n?"#0891b2":C.gray200}`,borderRadius:6,padding:"3px 10px",cursor:"pointer",...F.body,fontSize:11,fontWeight:700}}>{n}d</button>
          ))}
        </div>
        {paradosTempo.slice(0,20).map(p=>(
          <Linha key={p.id||p.vendasId} onClick={()=>onOpen&&onOpen(p)}>
            <span style={{fontWeight:700,color:C.black,minWidth:70}}>#{p.pedidoLinx||p.vendasId}</span>
            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.client}</span>
            <span style={{fontSize:11,color:C.gray500}}>{p.etapa}</span>
            <span style={{fontSize:11,fontWeight:700,color:"#0891b2"}}>{diasParado(p)}d parado</span>
            {btnChat(p.vendasId||p.pedidoLinx)}
          </Linha>
        ))}
        {paradosTempo.length===0&&<div style={{...F.body,fontSize:12.5,color:C.gray500}}>Nenhum pedido parado há {corte}+ dias.</div>}
      </Sec>

      <Sec icon="chat" cor={C.purple} titulo="Conversas dos pedidos"
        sub={totalChatNaoLidas>0?(totalChatNaoLidas+" mensagem(ns) não lida(s)"):"Atividade recente do chat"} count={threads.length}>
        {threads.slice(0,12).map(t=>(
          <Linha key={t.pedidoId} onClick={()=>onIrChat&&onIrChat(String(t.pedidoId))}>
            <span style={{fontWeight:700,color:C.black,minWidth:70}}>#{t.pedidoId}</span>
            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.cliente||"—"}</span>
            <span style={{fontSize:11,color:C.gray500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{t.ultimaMsg}</span>
            {t.naoLidas>0&&<span style={{background:C.red,color:C.white,borderRadius:10,fontSize:10,fontWeight:800,padding:"2px 7px"}}>{t.naoLidas}</span>}
          </Linha>
        ))}
        {threads.length===0&&<div style={{...F.body,fontSize:12.5,color:C.gray400}}>Nenhuma conversa ainda.</div>}
      </Sec>
    </div>
  );
}

export default function App(){
  useEffect(()=>{ carregarRespPV(); },[]);   // mapa "responsável pós-venda" (KV)
  useEffect(()=>{
    // Define o favicon (ícone da aba) e o título da página
    try{
      let link=document.querySelector("link[rel='icon']");
      if(!link){link=document.createElement("link");link.rel="icon";document.head.appendChild(link);}
      link.type="image/png";
      link.href=FAVICON_SGP;
      document.title="SGP · Gestão de Personalizados";
    }catch(e){}
    // Injeta keyframes globais (shimmer + spin) usados por skeletons e loaders
    try{
      const styleId="sgp-global-keyframes";
      if(!document.getElementById(styleId)){
        const st=document.createElement("style");
        st.id=styleId;
        st.textContent=`
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          @keyframes spin { to{transform:rotate(360deg)} }
        `;
        document.head.appendChild(st);
      }
    }catch(e){}
  },[]);
  return <ErrorBoundary><AppInner/></ErrorBoundary>;
}

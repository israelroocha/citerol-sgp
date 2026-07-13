import { useState, useEffect, useRef, useMemo, Component } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── VERSÃO ───────────────────────────────────────────────────────────────────
const SGP_VERSION = "v2.9.84";
if (typeof window !== "undefined") window.SGP_VERSION = SGP_VERSION;
const BRASAO_SGP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAba0lEQVR42u2deZRcVZ3HP+9V9ZZ0N2kSDCKbqHNAFAVFGRdcBkRBEWVAQWVxPW6g6KDiOMcjruioOMooUQFHDKMzoCOIoMZ9EAQRYRRQlC2GGLKn053urvfmj9/vR90UVd21vPtqu/ecOr3U9t693/v97b8bAd8ClgJzQEQYYfgdCTAK3AicWQQOBHYHZgMAw8gJgOPAJoAiMA1sB0oBgLmP1Pk96iMAFoEdBsAIiPWJAMD8R1wFjL08DG+Re/NhtIcJhlX1KfX77gsj3zEHTAC/Bt7jSKK+G8WAhbaAbwlwK3CqeiCKwExgwDDyYr5bgROBB3UNJvVnGgAYhk/w7api9wRgtYrdvwHbgEJgwDB8gm8Z8FPglcBaBVwKbFYQFgMDhpH1SNXCXQZcAZwMrFfwlXT+54C7AwDD8AG+VMXuV4DTVdTGlN0uNv+3dtBapHluhABAP6OkLDcGfBh4B+L3M4e/u9ioXjjVAeuR6nUP5gXCAEA/+t4iBdpbgPN0UaMK8OH8fQvwF2CojWK4pN9fAm7ICxsBgNnrexPA/Yib5TIFX1IFfC7jTAKrHOC2Y9OM63W8V/XRkTyuJQAwm2ELtRT4AfBi4DpdyNICrGbP/SewhXzdMale+1LgDuAFwG7Ac4CteeAjADAb9hjRxyeAk4C/KpDm6gRvrGL4amWiuZyuewDYBVgJHKW63/uBDXlthADA1ljP2ON+4FVqcJQqLN1GxqeAjZ6NgMSxzjcAbwbepOL305RdRMEK7mBdb04V9jHgG8CLgGsd1kiaAEUM3A58VFmwlDEIE/3MMWXrS5X1VurzbwaekbcaEJIRGrcUi2po3Al8BLhcn2uVORL9jAuBx6kFvY5y/lwrOl6EpMHHwC+U6X7sXPd+wFmq9+UaEuwHAKa0nupk2eK7qKj6N11ESyZIMxJbxoTvRfIE34r4B6ccV069oEN1PNMprwdWAN9xwG6uoXN1U20OAMxW5BRUVO7QyU6bBN64ft7Vqqf9JiPWq2URJ8A5wO/056OR0onpBb4vVv1xWH9fC3xfxewqB5ixY4icoirERtoQDuxVAJqusx34PfCYJsRWQRmvpOLqi+piMeAlnpR1Y+wI8SOuAl4NvBR4rG6Gys1kTDYFPKDAXaXXfY/zOnfDlIB9FODbaVM6WLEHWS9Cgv83AV/TxRtAEj6jOnSlIcQhvFUZ76vAD52FjnKwEi0eW0AyZT4NfB6pYHyCAmdCjYltas3ep3rpXfq3y4p2zSXnPgA+hFREbqJN6WDFHmO9EZ3Iz6me9nngEJ3guGJx3UUe0keChMSuBb4J3OwsWOzBMq3nngxAM3o9N9fp3Ygq9MFKFjwFOE5Fb9tyEXsBgDbJZpm+XwF0MXCkWpJu+lNBGXFAf58G7kXin9cgOXubqgCvXYVDSQX7RnUwZzIPMEuqknyAciY2AYDNL05R9aKVwL+oyLoIqbfYhISW7LU7VLTeDfwJ+C1Sof87tQBdlkg96nmtiOVmh4G3CHxc1ZTcrd5eAmAJWKwK9FmqqwG8UBXvD6uVN6mgW6dW4Wr9OVVDbHUS6LIcxn5nIg7oDXRAGUC3AtCKe24HzlDxCRJM/zISFvtpA3rSfGKrF4apIIcBZyvzxZ2yK7pN3ysh8ddr1TVxg07wPoiPbhESZnqOvmdIn7dHJdMl9HYqvCXBLgU+i/gJO6YLRtxl4IuU+S5UllurxkQE/CuwN+Vg/oXAE1XvwzEkeh1wlXqf+fc+ARxAuSyAAMDGwBerzncu8G4kVDWgP89Q8Wvgm9Idf5GCskR/lj1aStgZSCnoxk5Tu7oBgBaVGATepWLW3CmzwKH6f9eii9Xw2E/dMUsdN0ye7BN1APhegLimtnTienc6AFPK/rq3KaMVnOcWIelLwzy8vVxRQXkIEoRflLPuk5JNIkQrRscBiEM+pUO7n3UyABPHcHgbEpkoOi6SBHg78HRqpxEVVewciURHBh128sl8IH625W0AoblbliPloEsRZ3tHrnWnAtAtD3w78F8KpjnHqjsQyZlbSLQUkbSpk1RUp57v28C2XNk5zlEc29yMIe6oA2hDjl+vMOBipHXZNx3wRc51n0M51y2qAxQzwOMdgPseW4BjKdcEF3IC3wjwJeBwVUE62tfbiQBMkPZlH0OiG25xj03y0Yg3v5H08chxyeQ1t5t1oxyj91D0DL5hxP10DG1OMuhWAFpd7VcpF3S7wXjb4Wc1yWJ56mIWZZlT/fPpnkBoczSuRtqx3QK+TgNgCUkAXYWkpNuuTp1rTYFXAE+hAzI56gThjKoTlwBPzRCEkWOU7YUkrx5Nh8R4uw2Axmx3I3UQ0xW6WuQo12/U57ulpa2lfO0KfB14tmNMxS18Jvo5zwa+jcR5N9Bl8f1OAGDqsN2ZSLaKK3pd9nu5GhJTdFcYMUaydpYoCF9Dua64UOe9RM5rrTrvnUga2l6qD3ddckknLGKiovc84Gfs7Otz2W8IyfHr1gN1CmoEFYHzgQsUOCUWzsQxfdJea6z3QX1+ii4NNbZ7x5jedy3isa9WZWY7/kjgSXRYML2JDV9CfHMnq6vkEnU13VvDRWTgGwSeqZvQ2mhsbIBBAwCriN5BxEn8PkcvSqswJIgjuRcaeZtTehMSpfgg8I9qQKxn54o3U02eoqz5WJUEW9W46foEi3buHDu07jzgj1X0Plf3ezzwrC6xfBsRyTPKYqM1yMBUjb2Bg9WY2Uxr3RICAFUMjSNZyxfz8M6hlQtwLOIf7LUTPc2wmFuA2WfViInosbSydgHQDkk8Vye3lu5jXTuPotzdoBdHPaHEnmwk1Y6bsq4FKymn0yfzXNvBwP50cEZHGN0DQMvve0CV6nr6tTwPyeUrheUKAMzC8BhT18O98+h+xpQFNT7Cae4BgJmw3zDSTfSiBdjPrmtfR/wGAAYAtqz7LUJCUWuofmxBpVJ+MBJDDQwYANgy+w0q8P6jATAdQrlNRhgBgC3pfqPAVUgbsfl0P2PLCHFAd2vsN4wOAmABcaReWsdrDWwTSLeDmQDAAMBW2W8x4vO7mYUbPBrYHoXESoP+FwDYsv5XQNKHkjq+08C2pwI3CcvUu6OYA/gGkZODrnEYsZ6xB+UoSZTBdbSjJ4zbibWZ5wMAMxC/i5BO7X+tw/hwx96I39C6W7UySvpZgznObeRcf6nGJrLI0FC/qhl55QP+oEK81guau8imi6clvq7NcW7nkEaZ87VDS3UNNtCnoUafALTdvQ74X+d/9YAF4JNIP7usRHDkGDQ+9Ur77NVIt9aojutK1UtQ7xwFANa56CNq/d7bxMLbCUE+RGMeI0HKB8JoIwCLyLm5ZgmXOgAoeTJM1KHX1RcAtFYYv+4CoNADYO/KEXuc+AHkyIQ/VOhGYYThnQFTdS3c41ieaRObI8sqONNB89wIjVjvwQr2wIC3N6n/0Qaw+Bghi7uNOiAKwGaYKkVSsZ5MNrUg1lnhL5TPD/Gln9n1jyNt0iydrJYfMNZ7vFKt/og+0h2LHhdhBjkOqxm9tAQ8Fzl6IYuGO9b27TLgJ/gtcDcALUPqXkZYOBLyN+Dn+HE79R0ATeROIuG3ZtnmTqRrwtYMGNBOuczTL5cgRefTdQBwU78aab4YsKDMta4JANprVyuLDpBNo+929FApOIZINM9m7cczTB4Sdz4Y0OKbW5t8P0jm9IP07qnuYXgEYKziZ6YJpdpeu55yMD84dAMAG/7cjfOInnpEVwrcpgwYABgA2PDnbm0BgDZuokNP+AmjswGIWsGtiHGQ08wfDCwYANjosNy7VlwYkRoi/4f40tKMriuMPmHAmQyuLQF+RDbF6RHlVnBh9AEAs8hiBvgh4qjNwlc2GZa8fwDY6smUJobvQHIKWy3RtL7MPkSxNZAsVDzCaCMAixVM1ooYvpxs4rfrPYDN7jFBQm6z+nNTgFf9IMl6pMpYrQ5jvKuRxIY9aa5Vh3VjWNsi6GrVFy8BdnMeuyCt5cyJHoyfGipa0ZNIssPzWmVAi5VuRM4MPgcJ7heauNkdSHy5kWHfU6Kc2zeKnMP7ZOCJwGOQIvoJpAZ6wAHrNoL7qNqaPmQQFnVhYg8AXJIBAN0L/hpwii50Ix2zDMSbHQAudE2xAzyQHjXPAY4ADqXcNiTVa5nTxzTl8kqCHjgvIcwYAEsZ71ITdxNIEqh1t09bAHMBSe26FDlJs5EkBUt5WsPC5QEmag14ByMH5LwA6dRlyaM7kGQLe0/k/B5A1yAApxyREWUIwF2RftBZHBJt1/YV4JVIsme9LGj9af7ksH1SQ9yaqH0q8GaksHxMWW0L5USLALTWjd9J+8XH2Wt2EM2yjHRM66r1APCFJlwyMXBLjWtxWW93JAv7u8jxWYky3Yxj+QaDIhuS2mwLsznjSTUGXKy6UlZGjoHwYuBXagyU6gTfNPCbKuI3cj77JUgTpTeoPrfRYcYAuuyNkE22OOvJvkbCxN5+Hi58Gjngb64O5rbruB+JKbsAdO/5Awrs3Sn7CoOI9QvCB20RfHaM2t+DaC8gzY6+qJb23AKsOYykdW1yQGd64CJgBXC26iQ7CBnYeYjfElKIRazskLWz1Pw8+1dYlVm5eGKke9YNqmuWFthtP66wWFMF35fVqFlf4X4Jw68BskP1eWLKxT9ZA3BGXRe7ZagHuiJ0EjmyfgvV0/ZN/K5l51pgMzo+j5zCuS7oebmK3gKSrLzGBeBkxjqPAXA3JGqQNbuYb/BWFZ/DVQwME7HX6T2a+yRRne8EBV8QufmOos77egPFGvxkHZv+9TRPN2L64LeATyGO76RiEyRIc3QzKkrAccAZ6l4Jhka+I1GpdJ+K4dj8gPeRffWZ6YFPd77cxw0VgI8hJzDZsQ52Lt0fgVWUM7T3BD5M2TkexG7+YwBpOoABECTnbiBjkJiy+QTkzI/Ug5Lvdph/J+JAXqrifwS4QvUNY/f3KwjD2cPt1QNvo0Ivu5XsszZMD3wE8PfsHDPNmgUt2+VNSAb17mplXeYw8eHA8Wq0BL2vPcMMEANg4gJwm6eFiYAj8XsehrlmtgKnAb9AcgjvdqzeM/X+QqPM9up/qyk3rUoNcHchjcT3zVg8xUiywzPUIl6Hv/ZjBsItiG9vmLLD+XnKgFuD4dFW0TuMxOQtASaxAPs0co7bsAdDZAewF/B8D+6YWiDcpCLYvu9UwrGvnTAiykd2RLY4ppf9zDP6j/NoDVfTCY39HgE8i/Yc1dWporAd8zCg0umXDiZ2yo37JeIczNofaLlfz0Sc0j6s4WqANyCuQ/x+a5DYcalPgZhSPrV+MGdd2HzCv0dcYw+dGRM7Yuse4Ldkf0KlmyF9oku/OU7695B0q2uQRNkB+qt/szXIXKYG51dz9gRYi+QfUXFialzx82r89GGJlAVfhvjp8m44VFCL+CTgPUiG8xJ6oxF6PeJ2F/37fN2IQ9SfT5ml++V7rvh1gVdyALgOP1GRaSQ/8PicxHAlA9j3/TvSPPy7ugiL9Pmkx4CX6P0tRhJtX4Y44h+BZHtvI98Dy29CcjJ3OrItdhBpqVk/1QvPekEMhKc5nx/lvCi2G28HXgO8VidlQnWUbgZi6ui3i5FalhvUA3AS0mks0t8brSxs9boGkbJaC51CFZeIXcxKT+CIVfQ9QXXBvFnQXSSz/r8DHA28W3XgJUgIL+kiqzl1dLxxBd+vgdepuL2Scj3LuDLhVE5zbwcW3acSh0qxH1dRVH+COAsXe2ADc0y/UfWSdjWfNHAVdFOsQEov/wk5WmxcH1GHsmLqXNegGlaxGlmnKPCuQBIwCs59HAM8jvJ5JHmoPqNIRtJ6qvhi4yrK4gxwiSLXhxieAh6vorgdLFjNOiwgzusVSCnma1VvSih3PMBZ9LRNm8a+f0DZegwJbV2AJNeeBFxVBXgm+l5J7SMjfIwBpLjr4krjgxruEPt7VE3mfcg+c8Q9G+NIncCoA1imsigdVReOUXY8QOdlFonuzDoTGtFcsoV7qPcRSJ2EG6q0HMZjgW843/lXJNH2apVYG+a5B/uMZyJNnmZy3NxLkTS5t1DjuLZilQkxk3kF8GmyP73HwnN7INnMZ9AZqVGuLmX+0dv08RngSUh7DnOoL1PxZx2xZucR17XOCEmpr2ZmVlWDnyCJFtdTDjXiiLakymcZmF+lUm2KfOLh1g7lC7XYr9bE2P8WI6lN+3lSWi04faJObDMHGvoesSPG3LEX0pjoYOBA4NHAcp2zQWeuEmpnAdk8DynzHYbUr1RL1jAVYHuVa5tPJbCNtK+u5UhOInhO2W8F8K751jaaB70lBccKleNZ7xqr2bhdLdFJ/KZstcra0TwLPorkIO6pjz2UISdUTxupMtdT6ovbrBb4l1m4g2uhAtj1sFBJJc0/k08Zgmvc/YNawDVVrKiO3X85ksq02cPF2045HykU6kQWnG9uGgFDFpsgbeL1Y8p++1JuFOWb/ZYp4M9faE0XAmCiYuYqyk7OyMOOGQZO1onqFhDWYshqel5ax3uyvmebxxOACz0RSC23y+/UeNuxkFSLFxCRBSRP8AIVJz6AYRf4SRVdJbqvXsM1ANzHfOxY+R4fbpuCbuw0pzkw0J9DnWcfx3XcRKzWcD1dCJoVZ9tVRHxG3RK+6kf6ZZhVfChSj5NH3Ncynr6ANI+qS5LVQ8lWXHSLGiUFso9gGAgPUgD+mFC/kYW+eLaCcLtnAJaQyNavgLc77E4WADRqXYM4j4/DTyjHwnSH63fdHEDY9DwmwN7Ah5w19CVRLBy4DXi1upLiLAFoN1BEUmoe5ZnW55DIw61I9mwAYeMATIHXAy/GbyFW6rih3oY4yRsyIhsBkBkH70HqR5bQ2nlwtUSHXfwXkbYec4Q63kbmz/IAj8d/AX6CuNHOQ9x1xUZthLgJtE8iBeB/xk9WrXVUGEWSIg4JIGyY/Sx27TPtag7Jwvk68HGadJ/FTSC+gCSunopESEbw48ParrvrUsQXGUBY3/pEObheLIBwLfAO57tT3wA0UVxAgvSn6S4b8gjCZUiS7GEBhHWx31OQRgA+dfQJpL73DSrmm2420OwFuq1yT0eyNYY9gLCoIn8CSUc6ip1z3cJ4+DgZP8nELvh+40jAuJXvasU6Msv4z0g559FIcsFMxjsv1s8cVhfQenXRuLs+GB8yD3sA55LtuS+V4Lu+GXeLDwC6OuGf9cKO0ouc9gBCs7hfrAbKz5Vxg5umHPk4HXipSo04Y/AtRdLmXoM0NC1kMe9Z+IeMCe9FIhiHI77CrL3vtst3AM9FDgu8Hj+pYt3IfiPAR5UA5jJiP4vT74p0on090l4jzmrTxxnukALSeuHlyk7LyD5VybKV1yMp7FciWReWqdOPQDRxewSSJJuV68Wk2y7A59TgmMwSfGS8YO6plN9Wyj5MDRQfseMpnZyXI63fbnRY11cLuE5mwQ8iFW9ZqD/WQyYB3occX4aPec2aMazGYRapKtuo4tJOzfShF84hdRpHITHkO/uIDY39DkJSoGYdoDS7fnbU7j0qcr/t6JiZb2ofi+SexXEjkiFxKFJhN5WxdWZpW5NITcbLgL9TEK7zeI+dBsB3Ii3oWjE+zLW2BElAPh3x9XpNEPa5OMZC9zoi+amUD3nOmg2tMu0QJA66BElm2OLcay+JZov7Lgc+QrmpVDObew5J3Z/VzzqbchKD1+z0vApUJpHOSHcrGy5XXcUHG04h6UHPReppF+v3uuf9xj0APgPcq5C0+2YiH8Z6E0im05uQpIIoa2OjXQCsFMm3IT1CliHxXUs8yDID2iZuu+7qIxSIyykfypNWsGK3gK7g3J+B45M0doC3q+uN6/s+i9Rn30PZv5eLpMhTPzI23KQgvEPdBnsjkY4sa0HcDgEGRDum4SCd9DWUi2ZwFrcTAQc7FziNqiQ5C2nAXq+BZ8X3Qwq+XyBdCy6jfPxtkvdNtkNxNj/TBHJ8wmt1QlwxmTX4rafKYp3sO5EqvO8jsc3pGpszxW+9clQxL9TQux6pOvThavU/RlWNrXWuo0WNxlUv/yzSKTXJm/XaDUB3gW2in6iK74v0720Oi/kAYoREDkaUIe9EEit+jsSZV8+zeaKKz6v2e605rpzv+Rb9kUhO36H6OBApfrdTDaap0m+vyjBGG9d7vRSp111dobK0jebbLWbc3igvVLHyNBWTk56A6IIxRhIdLKVsnaoHv0XqW+9A8h83epqDIcSRvre6kA5Euoc9Wv8/pIw9Tbk5UVzH2hm4x/TnNUh1400OAbS9B2KnKOCxI+YG1Kp7K9KdappyEZQvHS1xjKUBXXQ7O2+bGi73I20m7ke6U61VUG7VjWJ6rHWfsh4xg8q0u+hjmTLZHkjM/FFqIC3R77WjxWb0kdZg34XuZVTfcx0SSrvGAV5KhyRwdJoF6IrlUaSf3euUFaZVhPgEYjWdr6BgHHCMgtQB26wy1A5dVGOpwYr3DjigdD9jjod31mqm3ZsLvCISBLgA8cEm7NzbpqMsrU50N7hiecwB4gG66NurKO7kCEoXJHEFYKIKnTBxGKeaMdNsb0HXuIgUeJEaVF9S4M1SvWdgAGCTQDweKQN4sv5/G+2P+6ZtmGtXfx3T369DOmxdRTkm3PF9drrBCVsJxCGkB/JpyGHYAwrEuQb0pG4dJrYHlfG2I0miFwE/qFAbuqLJejctViUQI8QJeyrSh27MMQZ864l5DwPTMJImtQ5pz3sJ0hHfnZ+uOhOvG9mimk5zEFKM8xJ1Z5jBUq/LolPZLnH0uyJyrO5/I5GLu+aZDwIA87OaXZfC7kiC6gkKykIXiufEcUeNqnV9I1IVeCUSynQNsK6uh+kVfamyl/OgiuWTkKyYCRXP0w5wO5XtFqmoXYsUfq9EIjS1Nh0BgJ11PwV27lmzP/AKJCPmsQrSSXY+MamdbJc4bJcgR4ddro97ulm/60cAVuqJLlMsQUJ9r0BqVRYrEHe0wWgxph5RxtuAnNF3GbDKYeqeELP9CMD5xDNI+4oTkYq6fRSE2yn71nzMi22GooI/QpIgrlDD4k7ntUV6/yjZvgEg84ix3dRyPhFJdTKf4gzZJava9w0p8LYip9NfpjretoqN0nNiNgBwYVaMgGerK+coJGFgO60lQbghsgGkLOC7wDeRdsc9aVQEADbHiq543k/dOCcgdbaWFlZPyM+AVEAc4yUk/Wkl8D9IQX3fsl0A4MKs6Cr84yqeT0ESQiMVn9WSQN0Q2RiS2f1DpHnjKnY+LLtv2S4AsHnxfCRSNvA81eW2Om6cRP83ivjurkBCZLdViNm+Z7swGt+clUz3DAXX35CIxAMqnv+AHDW2TwWQC2Eaw8hiVFbMPQ05hPkWpGn78nleG0YYmYpnl9UmAvBaG/8PqSn74hqrhpwAAAAASUVORK5CYII=";
const FAVICON_SGP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAKDUlEQVR42t2bfYwdVRnGfzNz9+5XP7ZLl6VNrUUbChRBFDVFCJGiRAQ/MBiwiCAo/6hoiJ+IiDEhMRiNWAXRYLR+kmIbLaAWBCvWNNrIR9Eibt2qtBXqtrvbhe69M+Mf85zs4WTmzszuvXs3nGTS9t6Zued9z/O+z/O+59QDdgJdQMzcGRHg6WrFCIEFwO0VYNEcc0Co+URADfBb9BsLge4KUNfVbgd4MngR8FdgA3CjPmuFA+pA5FtQa/dVA/qAfwPrgPuBwHJO0YsSz7QEXtMZNWAxsAu4ENgDjAPPApUS6Ax1f0fRZ/w5kOwiYBC4F7gIGJYR/wUeB7p1T6MRW+FzUA6sFnFCuxwQKwa7gXnALcBlwCHNyUz8+1rNKMMY8x4fWAJsA74MHCs0tA0BUQaFmQkHwAAwBFwCfMmK20iT94WKDcAyfW8Sdqj7OhU6db3j3XrfYiEil0YrLVjZGOhVDHuOQ7r03QFgPXAbMCaHhCnv8oDrgMNKjAsthBwF/glsEVKGgI8Bbwb2CTmFqOfpJumASIb0aVKDwGn6vKpVGgI2Ad8D/qXngoJwfSVwBtAPjAJ/V454Xt+fKuYILefl6YCvNQsBda1sBHxQf/8csFursUvx+YiQYQyPChhvKOsfutxR1fe3KiTGLPpkNkKgrlXfC7wXWAmsBk7RShxx7i9quBtWvsP15rNJ4PPAGuC5sjZVmmB8P/AnxWgVuENG/t4RMxQw3GsQilHK3GvA24CPA/+bjj1+E4x/GLgY2C/jO4AXgLuAc6yYDHPyTNVa1SILVxfSvmHlAWbLAQb224HLlaU/BJytBBUqHm+2VtXLmcMaUViUk8GN8S8Hfqh8MzldW6bzUKQfHQKukMEDwEetBORpkl4OrLEcE2o1zxC0K47TfL27DqwCNkofTJRJejN1QKwfqwFXS64CXAmsEPQ9R9QUHZNCzY+Bt6ZUqCZ/vAv4hRAwPhPjp+MAw583A3/R8wuUANMm45Wcy1GgR8LmW0KWQdE5wM+A7wDzxS4zMr6sA4zxDwJ3KmlFwPnAK5SIvCbMpyZYvx843qLB65RsD+ueGRtf1gGGc2+yJoUquKiJ7Suz4ocUBmaMy3i/ma0yv+Tq/1zQNxzcD7xWK9bswirISIJNHX6J+yYUl7YaWw0cV7TymovDL7j686XsHnNobZUVt2HGVYZh3Gdb3qeslIDjxhSnnSJBFDvvipTN+0rMpUMh1SUnd7agXC/tgFgTOyDJi7OqP1UdMOmEgHHIIWsV8zT+U9ITdcvpQwWEVMsd0A3sUFnrTma7rpk2UZCo+lFGmMbtygFGl++0VuUlNfIQYOTsk85q+fr8QuAsqTLfWdWqKsT1OSto3rUCuEbhZOZ2J8k+QdscYOTpcIYDTgU+pVivpBRMjwHftKrBuEExtAz4tJxp+odbrNbZrDsgtvj/YEbc7lAXZtRBQKTnRkrMpUayETJhsUCt3SFgEHDEMdxk7l2Sp91iB7sLXCmRMzz9VsUqgyuzIa6KCqEwAx37lCCzdm+iDBr05JzACo36XFWCfsZ95rNNpO/f+Spg7G6Q0fO26qvr+fntYoE4hwY7percpqVBxS9J2tVLLEFkhNA+x1nmmUHgjcDrgRP07z6FW0t537XPVHW9VgvLpcBukk3H4Yzu0KiaobdKzHRYIbLbqfNXAh9Wx+c4q3Vmb3nN5pjwLdrJQkAXU3tzXsr3PslOz5/VHQqt3sFOK8NfCzwAfEBwHyFpZY+pmTLbOSAGRnymNhPiBj3AEzMcYJ55AfiEFe8dwH+AR/X9LcBX9a6DTG2QBlaOmc1y2tNC7fdJdnSCBjfWgVc79OeiIJAmuFGx3KXyeQS4nmTT8oBFj+3uHQTSG3t9kvM4WSrN1+qepo5QVusr1EtvJ2ltL9LfTwJukMAJ5kjTxFS4zwHDFcXp0Qyq8/TdMuANwG90X5iBBI9kU/Rp4AmSFndsoaRl2bxEd8sw225gzFeP7xkaHynxgXfm0FNs5YC7SDrFb7I6O3GLDDcdq6L0aRCw3Rg2qvjtyYhxI2jeIq7P87bRAHuA98m5A1Y+iZtoeI+6SFukRYqccwhkz4OummuUMSclVq4g//BBbHH6r4C1JCdBAI6Rc6bT84ssB86T4U+R7B98EVie0plKe0evKPtJwDP081sVNlkoCMTXV2k1i8acob3PkBxduUPFU7/Yomol0XrKZTuoVw7sAP5AchBjLUmr/hrNq1bAiVXgB4biTdVVl3G3MXU2zx11ksNH61W3VwqKF89JnMdq4ueJXZbI8RUHRZ0ku8079I7P6j2bSI7GYMnqh8RS9RxR161QOVfs9qIefyewlaTVnbXRESvO3g78keLne7DEjn1/jzpBK4ClQkVFkx0H7taCeCnVZFUMda1keN7pELOAV5J0uAMg9CyohvLMPerwBA28OKSkOEb5XWDPythlnwucErsial5N490pc5jjfuBSe86BI3mHRCnniR2CDF2wnGR7ejPT2xKzKdO3ymTfueKM/oJxxFrgIzQ+GGV4f4TkMMeojaggJWn9juSQwkmkb3mbAup1gvADMxQ5sYUG92qEhljZf5XiOStkPc3zaom+wH53kKH9t8q7LyN9H9444VzB8CEH2q1u4kQq0G5qoGKNY/tVj9ydlrP8DEn5LPAe4G+inloDivukkpBvFTutruQQnBdkMJGR5YvEWN/NSthejpcHVeuf3aCgCeWkrar6hlOor5nGxzJsm7U4npPwevT715OcNslkqyCnJT4uyhgAztTL3f/GYu47keQExyHtB8RW5m7WMN2mS0lOl486iTwU5PeL7jbnUXVQYF+gBtxHskNzlrw+4SDIV1enV0XTGtX/e6ycEJRsfHgOI9ga4itMnRI3easqZGxRDfJ4EZ0SFMjQZiKPqgG6VAouMGrKgfzzanReItREao5OpFSFfsrlOUnMvparpXaxfsfM7xiF6A1qyowVFWllGhT2Cy9SC+x0GTbhtM/NJsl8PbdX5ec2ld/Dgm+j0SOZfALwGnWQX6VVNkJtodjoJ0rEzzgOpJkOsFnDiIt1kqInCw1HHGRFlq7v0e+Nq3u8X38eZuqoa5eMWqwEPKBMX1GlZ06a9+mZe4Gvy6mUlObTckAaGnpFmVeRbJYaHR9ZkLZlb6BkZrbBfCfDR1Z1WJPhpju9QKt/H/BtlbWkSOSWOyCtyusALlB9fqZWfNwSKn6KSIlT8o3bbO0VgoZVCW6QPnEROSNRQRMdgaT0ZXLIMqY2WOMcJoismn2eELCT5CjOZlV8TTG8mQ5wHWFDcRB4h0LkdEF+jKmTnvZBaZP4ukWhv1Zy2+ZQadwMw1vhgEa1v09y1nedyuh+OcKEh2lqPkFyHvgeXnwwYtox3u6RpgRXAl+QsYfFBhvVZKk6Rvu8hEbgOGMpyf/1ucC5b1Z3jv4P/RIZdLgDoQUAAAAASUVORK5CYII=";


// ─── TOKENS ──────────────────────────────────────────────────────────────────
// ─── WORKER CONFIG ────────────────────────────────────────────────────────────
const WORKER_URL = "https://citerol-sgp.israel-caetano-lima.workers.dev";
const SGP_TOKEN  = "sgp_citerol_2024_xK9mP";

async function apiFetch(path, method = "GET", body = null) {
  const doFetch = () => fetch(`${WORKER_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-SGP-Token": SGP_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
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
        throw new Error(`Worker ${method} ${path} → ${res.status}`);
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
    const r = await apiFetch("/snapshot-aberto" + (force ? "?force=1" : ""));
    _snapState.data = r;
    _snapState.error = null;
    _snapState.lastFetch = Date.now();
  } catch (e) {
    _snapState.error = e.message || "erro ao carregar";
  } finally {
    _snapState.loading = false; _emitSnap();
  }
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
    ? "Não foi possível atualizar — última carga " + _ageStr(snap.lastFetch)
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
};

// ─── ÍCONES SVG ───────────────────────────────────────────────────────────────
// Cada ícone é um path SVG 24x24, traçado monocromático
const ICONS = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  pin:       "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
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
};

// ─── MÓDULOS DO SISTEMA ───────────────────────────────────────────────────────
// Cada módulo é uma permissão individual atribuível a um usuário.
const NAV_ITEMS = [
  // Principal
  {id:"demandas",    label:"Minhas Demandas",    icon:"pin",     grupo:"Principal"},
  {id:"dashboard",   label:"Dashboard",          icon:"grid",    grupo:"Principal"},
  {id:"funil",       label:"Funil em Tempo Real",icon:"funnel",  grupo:"Principal"},
  {id:"posvenda",    label:"Painel Pós-Venda",   icon:"phone",   grupo:"Principal"},
  // Análise
  {id:"painel_fluxo",    label:"Painel de Fluxo",          icon:"activity",grupo:"Análise"},
  {id:"gestao_vista",    label:"Gestão à Vista",           icon:"monitor", grupo:"Análise"},
  {id:"pedidos_risco",   label:"Pedidos em Risco",         icon:"warn",    grupo:"Análise"},
  {id:"alteracoes_form", label:"Alterações de Formulário", icon:"warn", grupo:"Análise"},
  {id:"rel_pendencias",  label:"Relatório de Pendências",  icon:"clock",   grupo:"Análise"},
  // ── Separação ─────────────────────────────────────────────────────────────
  {id:"em_separacao",            label:"Em Separação",             icon:"inbox",   grupo:"Separação"},
  {id:"conferencia_separacao",   label:"Conferência Separação",    icon:"check",   grupo:"Separação"},
  // ── Amostra ───────────────────────────────────────────────────────────────
  {id:"programacao",             label:"Programação",              icon:"needle",  grupo:"Amostra"},
  {id:"amostra_digital",         label:"Amostra Digital",          icon:"monitor", grupo:"Amostra"},
  {id:"aprovacao_amostra_digital",label:"Aprovação Amostra Digital",icon:"check", grupo:"Amostra"},
  {id:"amostra_fisica",          label:"Amostra Física",           icon:"scissors",grupo:"Amostra"},
  {id:"aprovacao_amostra_fisica",label:"Aprovação Amostra Física", icon:"check",   grupo:"Amostra"},
  // ── Operação ──────────────────────────────────────────────────────────────
  {id:"conferencia_direcionamento",label:"Conferência e Direcionamento",icon:"arrow",grupo:"Operação"},
  {id:"bordado_interno",         label:"Bordado Interno",          icon:"needle",  grupo:"Operação"},
  {id:"bordado_externo",         label:"Bordado Externo",          icon:"box",     grupo:"Operação"},
  {id:"expedicao",               label:"Expedição",                icon:"box",     grupo:"Operação"},
  // ── Outros (fora de grupo, colapsável) ────────────────────────────────────
  {id:"analise_frete",           label:"Análise de Frete",         icon:"send",    grupo:"Outros"},
  {id:"finalizados",             label:"Finalizados",              icon:"check",   grupo:"Outros"},
  {id:"impressao_pedido",        label:"Impressão de Pedido",      icon:"print",   grupo:"Outros"},
  {id:"pendencia_comercial",     label:"Pendência Comercial",      icon:"clock",   grupo:"Outros"},
  {id:"aguardando_pedido",       label:"Aguardando Outro Pedido",  icon:"clock",   grupo:"Outros"},
  {id:"pedidos",                 label:"Pedidos em Aberto",        icon:"list",    grupo:"Outros"},
  {id:"banco_imagens",           label:"Banco de Imagens",         icon:"image",   grupo:"Outros"},
  // Cadastros
  {id:"codigos_barra", label:"Códigos de Barra",   icon:"barcode", grupo:"Cadastros"},
  // Sistema
  {id:"sla",         label:"Configurações",     icon:"gear",    grupo:"Sistema"},
  {id:"usuarios",    label:"Usuários",           icon:"users",   grupo:"Sistema"},
];

// Mapeia módulo de operação -> etapa do funil (para "Minhas Demandas")
const MODULO_ETAPA = {
  em_separacao:               "Em Separação",
  conferencia_separacao:      "Conferência Separação",
  conferencia_direcionamento: "Conferência e Direcionamento",
  programacao:                "Programação",
  amostra_digital:            "Amostra Digital",
  aprovacao_amostra_digital:  "Aprovação de Amostra Digital",
  amostra_fisica:             "Amostra Física",
  aprovacao_amostra_fisica:   "Aprovação de Amostra Física",
  bordado_interno:            "Bordado Interno",
  bordado_externo:            "Bordado Externo",
  expedicao:                  "Expedição",
  analise_frete:              "Análise de Frete",
  pendencia_comercial:        "Pendência Comercial",
  aguardando_pedido:          "Aguardando Outro Pedido",
};
// Mapa módulo -> endpoint do Worker (para carregar demandas ao vivo)
const MODULO_ENDPOINT = {
  em_separacao:               "/em-separacao",
  conferencia_separacao:      "/conferencia-separacao",
  conferencia_direcionamento: "/conferencia-direcionamento",
  programacao:                "/programacao",
  amostra_digital:            "/amostra-digital",
  aprovacao_amostra_digital:  "/aprovacao-amostra-digital",
  amostra_fisica:             "/amostra-fisica",
  aprovacao_amostra_fisica:   "/aprovacao-amostra-fisica",
  bordado_interno:            "/bordado-interno",
  bordado_externo:            "/bordado-externo",
  expedicao:                  "/expedicao",
  analise_frete:              "/analise-frete",
  pendencia_comercial:        "/pendencia-comercial",
  aguardando_pedido:          "/aguardando-pedido",
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
  if (user.admin) return true; // admin vê tudo
  return (user.modulos || []).includes(moduloId);
}

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
const dataVencimento=(o)=>o.dataVencimento||null;
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
// Quantidade de peças do pedido: usa items quando enriched, senão cai pro qtdTotal do snapshot
function pecasDoCard(o){
  if (!o) return 0;
  const somaItems = (o.items||[]).reduce((s,i)=>s+Number(i.qty||0),0);
  if (somaItems > 0) return somaItems;
  return Number(o.qtdTotal||0);
}
// Recalcula statusSeparacao a partir dos items enriched (fonte mais confiável que snapshot).
// Retorna: "completa" | "parcial" | "pendente" | "sem_pedidos" | "carregando"
function statusSepDoOrder(o){
  if (!o) return "carregando";
  const its = o.items || [];
  if (its.length === 0) {
    // Sem items enriched ainda: usa o do snapshot, mas se for "sem_pedidos", trata como carregando
    // (snapshot pode estar desatualizado — só confirmamos "sem pedidos" depois do enriched chegar)
    const snap = o.statusSeparacao || "pendente";
    if (snap === "sem_pedidos") return "carregando";
    return snap;
  }
  // Enriched carregado: recalcula localmente
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
  const info = SEPARACAO_INFO[status] || SEPARACAO_INFO.indisponivel;
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
const normalizarCard=(o,etapa)=>({
  id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
  pedidoLinx:o.pedidoLinx||"",
  client:o.client||"",vendedor:o.vendedor,valor:o.valor||0,
  cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",tel:o.telefone||"",email:o.email||"",
  obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
  condicaoPagamento:o.condicaoPagamento||"",arquivoDtfsilk:o.arquivoDtfsilk||[],
  arqProgramacao:o.arqProgramacao||"",arqAmostraDigital:o.arqAmostraDigital||"",arqAmostraFisica:o.arqAmostraFisica||"",
  motivoRejAmDigital:o.motivoRejAmDigital||"",motivoRejAmFisica:o.motivoRejAmFisica||"",
  reprogramacao:o.reprogramacao||false,
  historico:o.historico||[],
  houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
  temBordado:o.temBordado!==false,dataVencimento:o.dataVencimento||null,
  prazoFinal:o.prazoFinal||null,
  qtdTotal:Number(o.qtdTotal||0),qtdSeparada:Number(o.qtdSeparada||0),
  totalItensSeparacao:Number(o.totalItensSeparacao||0),qtdItensSeparados:Number(o.qtdItensSeparados||0),
  statusSeparacao:o.statusSeparacao||"pendente",
  subEtapa: o.subEtapa || "",
  stageIdAtual: o.stageIdAtual || o.stageId || null,
  stageIdPV: o.stageIdPV || null,
  stageIdBordado: o.stageIdBordado || null,
  etapasAtivas: Array.isArray(o.etapasAtivas) ? o.etapasAtivas : [(o.etapa || etapa)],
  etapa:o.etapa||etapa,amOk:o.amostrasAprovada||false,sepOk:o.separacaoCompleta||false,
  statusFaturamento: o.statusFaturamento || "",
  entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
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
    status: (it.statusSeparacao === "completa" || it.separado === true) ? "separado" : "pendente",
    descricao: it.descricao || "",
  })),
  timeline:[{stage:o.etapa||etapa,user:"Sistema",enteredAt:o.etapaAt||o.dataEntrada,exitedAt:null,dH:null}],
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
    const venc=o.dataVencimento?new Date(o.dataVencimento).toLocaleDateString("pt-BR"):"";
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
const hrsIn=(at)=>(Date.now()-new Date(at).getTime())/3600000;
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
  const venc=dataVencimento(o);
  const htd=venc?(new Date(venc).getTime()-Date.now())/3600000:null;
  return{sla,hrs,pct,htd,venc,st:pct>=1?"late":pct>=0.8?"risk":"ok",ft:htd==null?"none":htd<0?"late":htd<24?"risk":"ok"};
}

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
const F = {
  title: { fontFamily:"'Oswald',sans-serif", textTransform:"uppercase", letterSpacing:"0.04em" },
  body:  { fontFamily:"'Montserrat',sans-serif" },
};

// ─── EXIBIÇÃO DE ARQUIVOS (resolve fileIds do HubSpot) ────────────────────────
function ArquivosBox({fileIds,titulo,emptyText}){
  const [arquivos,setArquivos]=useState(null);
  const [loading,setLoading]=useState(false);

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
            ?<a href={a.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:5,background:C.red,color:C.white,borderRadius:6,padding:"7px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                <Ic n="download" s={13} c={C.white}/> Baixar
              </span>
            </a>
            :<span style={{...F.body,fontSize:11,color:C.gray400}}>indisponível</span>
          }
        </div>
      ))}
    </div>
  );
}

function Av({ini,size=32,bg=C.red}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,...F.title,flexShrink:0}}>{ini}</div>;
}

function Tag({label,color=C.gray600}){
  return <span style={{background:color+"18",color,border:`1px solid ${color}30`,borderRadius:3,padding:"2px 8px",fontSize:11,fontWeight:600,...F.body,display:"inline-block"}}>{label}</span>;
}

function Card({children,style={},onClick}){
  return <div onClick={onClick} style={{background:C.white,borderRadius:8,padding:18,border:`1px solid ${C.gray200}`,cursor:onClick?"pointer":"default",...style}}>{children}</div>;
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

function Btn({label,onClick,variant="primary",size="md",icon,style={}}){
  const bg={primary:C.red,secondary:C.white,success:C.green,ghost:"transparent",danger:C.red+"14"}[variant];
  const fg={primary:C.white,secondary:C.gray700,success:C.white,ghost:C.gray600,danger:C.red}[variant];
  const br={primary:"none",secondary:`1px solid ${C.gray200}`,success:"none",ghost:"none",danger:`1px solid ${C.red}30`}[variant];
  const pd={sm:"5px 12px",md:"8px 16px",lg:"11px 22px"}[size];
  const fs={sm:12,md:13,lg:14}[size];
  return(
    <button onClick={onClick}
      style={{display:"inline-flex",alignItems:"center",gap:6,background:bg,color:fg,border:br,borderRadius:6,padding:pd,fontSize:fs,fontWeight:600,cursor:"pointer",...F.body,...style}}
      onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      {icon&&<Ic n={icon} s={13} c={fg}/>}{label}
    </button>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({user,active,onNav,collapsed,onToggle}){
  const items=NAV_ITEMS.filter(n=>temAcesso(user,n.id));
  const GRUPOS=["Principal","Análise","Separação","Amostra","Operação","Outros","Cadastros","Sistema"];
  const groups=GRUPOS.map(label=>({label,items:items.filter(n=>n.grupo===label)}));
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
    <div style={{width:collapsed?56:240,background:C.white,borderRight:`1px solid ${C.gray200}`,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",flexShrink:0}}>
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
      <div className="sgp-scroll" style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
        {groups.map(g => (
          <MenuGrupo
            key={g.label}
            grupo={g}
            collapsed={collapsed}
            active={active}
            onNav={onNav}
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
function MenuGrupo({grupo, collapsed, active, onNav}) {
  const gi = grupo.items;
  const podeColapsar = grupo.label === "Outros" || grupo.label === "Cadastros";
  const chaveLS = "sgp_menu_grupo_" + grupo.label;
  const [aberto, setAberto] = useState(() => {
    if (!podeColapsar) return true;
    const salvo = typeof localStorage !== "undefined" ? localStorage.getItem(chaveLS) : null;
    // Padrão: "Outros" começa fechado, "Cadastros" começa fechado
    return salvo === null ? false : salvo === "1";
  });
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
            display:"flex", alignItems:"center", justifyContent:"space-between",
            cursor: podeColapsar ? "pointer" : "default",
            userSelect: "none",
          }}
        >
          <span>{grupo.label}</span>
          {podeColapsar && (
            <span style={{display:"inline-flex", transition:"transform 0.15s", transform: aberto ? "rotate(0deg)" : "rotate(-90deg)"}}>
              <Ic n="chevDown" s={10} c={C.gray400}/>
            </span>
          )}
        </div>
      )}
      {(collapsed || !podeColapsar || aberto) && gi.map(n => {
        const on = active === n.id;
        return (
          <div key={n.id} onClick={()=>onNav(n.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px 0":"8px 20px",cursor:"pointer",background:on?C.red+"0e":"transparent",borderLeft:on?`2px solid ${C.red}`:"2px solid transparent",color:on?C.red:C.gray600,justifyContent:collapsed?"center":"flex-start"}}
            onMouseEnter={e=>{if(!on)e.currentTarget.style.background=C.gray50;}}
            onMouseLeave={e=>{if(!on)e.currentTarget.style.background="transparent";}}>
            <Ic n={n.icon} s={15} c={on?C.red:C.gray500}/>
            {!collapsed&&<span style={{...F.body,fontSize:13,fontWeight:on?600:400,whiteSpace:"nowrap"}}>{n.label}</span>}
          </div>
        );
      })}
    </div>
  );
}

function BottomNav({user,active,onNav}){
  const allItems=NAV_ITEMS.filter(n=>temAcesso(user,n.id));
  const mainItems=allItems.slice(0,4);
  const [showDrawer,setShowDrawer]=useState(false);

  const GRUPOS=["Principal","Análise","Separação","Amostra","Operação","Outros","Cadastros","Sistema"];
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
  const eRef=useRef(null);

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
    if(!msg.trim()||enviando)return;
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
      await apiFetch("/conversa/"+encodeURIComponent(pedidoId),"POST",{
        autor:me.nome||me.name||me.email, autorEmail:me.email,
        mensagem:msg.trim(), mencionados, cliente:order.client||"",
      });
      setMsg("");setShowM(false);
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
                <div style={{...F.body,fontSize:13,color:C.gray700,marginTop:4,lineHeight:1.6,background:C.gray50,borderRadius:6,padding:"8px 12px",border:`1px solid ${C.gray200}`,wordBreak:"break-word"}}>
                  {String(m.mensagem||"").split(/(@[\wÀ-ÿ]+)/).map((p,j)=>p.startsWith("@")?<span key={j} style={{color:C.red,fontWeight:700}}>{p}</span>:p)}
                </div>
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
        <div style={{display:"flex",gap:8}}>
          <input value={msg} onChange={e=>hc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Mensagem... @ para mencionar"
            style={{flex:1,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",...F.body}}/>
          <button onClick={send} disabled={enviando} style={{background:enviando?C.gray300:C.red,color:C.white,border:"none",borderRadius:6,padding:"9px 14px",cursor:enviando?"wait":"pointer",display:"flex",alignItems:"center"}}>
            <Ic n="send" s={15} c={C.white}/>
          </button>
        </div>
        <div style={{...F.body,fontSize:10,color:C.gray400,marginTop:5}}>Todos no pedido veem a conversa. Quem for mencionado com @ recebe uma notificação.</div>
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

  return(
    <div style={{padding:20}}>
      {hist.map((t,i)=>{
        const act=i===hist.length-1; // última = etapa atual (em andamento)
        return(
        <div key={i} style={{display:"flex",gap:14,marginBottom:22,position:"relative"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:act?C.red:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1}}>
              <Ic n={act?"up":"check"} s={12} c={C.white}/>
            </div>
            {i<hist.length-1&&<div style={{width:1,flex:1,background:C.gray200,marginTop:4,minHeight:16}}/>}
          </div>
          <div style={{flex:1,paddingTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,alignItems:"center"}}>
              <span style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{t.stage}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {t.origem&&<Tag label={t.origem} color={t.origem==="Bordado"?C.purple:C.teal}/>}
                {act&&<Tag label="Em andamento" color={C.red}/>}
              </div>
            </div>
            <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>Por: {t.who||"Sistema"}</div>
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
}


// ─── EXECUÇÃO POR BORDADO (Programação: c/ dificuldade · Amostra: s/ dificuldade) ─
function ExecPorBordado({order,etapa,onAction,comDificuldade,setActionMsg,setActionDone,loadingDet,me,setTemPendencias}){
  const ehAmostra=etapa!=="Programação";
  const todos=(order.bordadosJson||[]).filter(b=>b&&(b.fileName||b.fileId));
  const filtro=ehAmostra?/~(prog|amostra)/i:/~prog/i;
  let bordados=todos.filter(b=>filtro.test(b.fileName||""));
  if(!bordados.length) bordados=todos;
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
  const assumirBordado = async (b) => {
    if (!order.bordadoId) { alert("Pedido sem negócio de Bordado."); return; }
    setAssumindoKey(b.fileName);
    try {
      const r = await apiFetch("/programacao-assumir","POST",{
        bordadoId: order.bordadoId, fileName: b.fileName || "",
        userId: meuId, userName: meuNome,
      });
      if (r.success) setAssumidos(r.assumidos);
      else alert("Não foi possível assumir: " + (r.error||"erro desconhecido"));
    } catch(e) { alert("Erro: "+e.message); }
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
      const r = await apiFetch("/programacao-dispensar","POST",{
        bordadoId: order.bordadoId,
        nomeArquivo: b.fileName || "",
        motivo: motivo.trim(),
        executor: meuNome,
      });
      if (r.success) {
        setExecutados(r.executados || []);
      } else {
        alert("Erro: "+(r.error||"desconhecido"));
      }
    } catch(e) { alert("Erro: "+e.message); }
    setDispensandoKey(null);
  };                                   // legado: sem termo → todos
  // REGRA CRÍTICA: se não temos bordado real pra programar/amostrar, NUNCA
  // criamos item fictício ("Programação geral"). Pra a Programação isso é
  // sensível — programadora é terceirizada e o que ela anexar vira cobrança.
  // Estados possíveis:
  //  - loadingDet && bordados vazio → mostra "Carregando bordados..."
  //  - !loadingDet && bordados vazio → mostra alerta "Nenhum bordado pra ..."
  //  - bordados existem → renderiza normal
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
  const TITULOS={"Programação":"PROGRAMAÇÃO DE BORDADO","Amostra Digital":"ENVIAR AMOSTRA DIGITAL","Amostra Física":"CONFIRMAR AMOSTRA FÍSICA"};
  const HINTS={"Programação":"Para cada bordado: baixe a referência, informe a dificuldade e anexe o(s) arquivo(s) programado(s).","Amostra Digital":"Para cada bordado: baixe a referência e anexe a(s) imagem(ns) da amostra digital.","Amostra Física":"Para cada bordado: baixe a referência e anexe a(s) foto(s) da amostra física."};
  // Programação: aceita QUALQUER formato (a programadora pode anexar .emb, .dst,
  // .pes, .jef, imagens etc). Se restringir por accept, o dialog do navegador
  // trata como "arquivos personalizados" e esconde os outros — a operadora pode
  // não achar o arquivo que quer. Amostras: só imagens (é o que a operação
  // sempre anexa nessa etapa).
  const ACCEPT=comDificuldade?"":"image/*";
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
        dificuldade: saved[k]?.dificuldade || "",
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
          dificuldade: v?.dificuldade || "",
          filesNomes: (v?.files || []).map(f => f.name),
        };
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {}
  },[data]);
  const ehImagem=(n="")=>/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(n);
  const nomeLimpo=(n="")=>n.replace(/\s*~(PROG|AMOSTRA)/gi,"").trim()||n;
  const setDif=(k,d)=>setData(p=>({...p,[k]:{dificuldade:d,files:p[k]?.files||[]}}));
  const addFiles=(k,fl)=>setData(p=>({...p,[k]:{dificuldade:p[k]?.dificuldade||"",files:[...(p[k]?.files||[]),...Array.from(fl)]}}));
  const rmFile=(k,idx)=>setData(p=>({...p,[k]:{dificuldade:p[k]?.dificuldade||"",files:(p[k]?.files||[]).filter((_,i)=>i!==idx)}}));
  const DIFS=[["Fácil",C.green],["Médio",C.amber],["Difícil",C.red]];

  const confirmar=async()=>{
    // Se etapa é Programação com sistema de "assumir": só valida/envia os que EU assumi
    const bordadosPraExecutar = ehProgAssumivel
      ? bordados.filter(b => {
          const a = findAssumido(b.fileName || "");
          return a && String(a.userId) === meuId;
        })
      : bordados;
    if (ehProgAssumivel && !bordadosPraExecutar.length) {
      alert("Você não assumiu nenhum bordado. Clique em 'Assumir esta programação' primeiro.");
      return;
    }
    for(const b of bordadosPraExecutar){
      const i=bordados.indexOf(b);
      const st=data[keyOf(b,i)]||{dificuldade:"",files:[]};
      if(comDificuldade&&!st.dificuldade){alert(`Defina a dificuldade do bordado: ${nomeLimpo(b.fileName)}`);return;}
      if(!st.files.length){alert(`Anexe ao menos um arquivo para: ${nomeLimpo(b.fileName)}`);return;}
    }
    setEnviando(true);
    try{
      const toB64=(f)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
      const execucoes=[];
      for(const b of bordadosPraExecutar){
        const i=bordados.indexOf(b);
        const st=data[keyOf(b,i)]||{dificuldade:"",files:[]};
        const arquivos=[];
        for(const f of st.files) arquivos.push({fileBase64:await toB64(f),fileName:f.name});
        execucoes.push({nomeArquivo:nomeLimpo(b.fileName),dificuldade:comDificuldade?st.dificuldade:"",arquivos});
      }
      const m=await onAction(order.id,"exec_bordado",{execucoes});
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

  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
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
      {bordados.map((b,i)=>{
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
              <span style={{...F.body,fontSize:11,color:C.gray500}}>{executado.dispensado ? "Não precisa programar" : "Você pode substituir se necessário"}</span>
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
                {(b.productName||b.positionLabel)&&<div style={{...F.body,fontSize:12,color:C.gray600,marginTop:3,fontWeight:600}}>
                  {b.productName && <span>👕 <strong>{b.productName}</strong></span>}
                  {b.productName && b.positionLabel && <span style={{color:C.gray400,margin:"0 5px"}}>·</span>}
                  {b.positionLabel && <span style={{color:C.gray500}}>📍 {b.positionLabel}</span>}
                </div>}
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
              <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{comDificuldade?"Arquivo(s) programado(s)":"Arquivo(s) da amostra"}</div>
              <input type="file" multiple accept={ACCEPT}
                ref={el => { if (el) inputsRef.current[k] = el; }}
                style={{display:"none"}}
                onChange={e=>{
                  const files = e.target.files;
                  if (files && files.length) addFiles(k, files);
                  // Reset APÓS microtask pra o React processar addFiles antes
                  setTimeout(() => { if (e.target) e.target.value = ""; }, 0);
                }}/>
              <button type="button"
                onClick={()=>{
                  const el = inputsRef.current[k];
                  if (el) el.click();
                }}
                style={{padding:"9px 14px",borderRadius:7,border:`1.5px dashed ${C.gray300}`,background:C.gray50,color:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none"}}>
                <Ic n="box" s={14} c={C.gray500}/> Anexar arquivo
              </button>
              {ehProgAssumivel && ehMeu && !jaExecutado && <button type="button"
                onClick={()=>dispensarBordado(b)}
                disabled={dispensandoKey===b.fileName}
                style={{marginLeft:8,padding:"9px 14px",borderRadius:7,border:`1.5px solid ${C.amber}`,background:"#fef3c7",color:"#92400e",cursor:dispensandoKey===b.fileName?"wait":"pointer",...F.body,fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none"}}>
                <span style={{fontSize:14}}>⊘</span> {dispensandoKey===b.fileName ? "Dispensando..." : "Não precisa programar"}
              </button>}
              {st.files.length>0&&<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
                {st.files.map((f,idx)=>(
                  <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,background:C.green+"0e",border:`1px solid ${C.green}30`,borderRadius:6,padding:"7px 10px"}}>
                    <span style={{...F.body,fontSize:12,color:C.gray700,wordBreak:"break-all",display:"inline-flex",alignItems:"center",gap:6}}><Ic n="check" s={12} c={C.green}/> {f.name}</span>
                    <button onClick={()=>rmFile(k,idx)} style={{background:"none",border:"none",cursor:"pointer",color:C.gray400,fontSize:15,lineHeight:1,flexShrink:0}}>✕</button>
                  </div>
                ))}
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
function RetirarConferirAcao({order, me, setActionMsg, setActionDone}){
  const totalPecas = order.items.reduce((s,i)=>s+Number(i.qty||0),0);
  const totalSeparado = order.items.reduce((s,i)=>s+Number(i.qtdSeparada||0),0);
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

function AcaoTab({order,me,uploadFile,setUploadFile,uploadName,setUploadName,obsText,setObsText,actionDone,setActionDone,actionMsg,setActionMsg,itemSel,itemDest,nSel,allDestDefined,skus,itensDirecionaveis,toggleItemSel,selAllItems,setDestSel,setDestAll,setDestOne,onAction,isMobile,loadingDet,setTemPendencias}){
  const etapa=order.etapa;
  const[uploading,setUploading]=useState(false);
  const[bipReady,setBipReady]=useState(false);
  const bipInfoRef=useRef({});

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

  // ── EXECUÇÃO POR BORDADO: Programação (c/ dificuldade) e Amostras (s/ dificuldade) ─
  if(etapa==="Programação"||etapa==="Amostra Digital"||etapa==="Amostra Física"){
    return <ExecPorBordado order={order} etapa={etapa} comDificuldade={etapa==="Programação"} onAction={onAction} setActionMsg={setActionMsg} setActionDone={setActionDone} loadingDet={loadingDet} me={me} setTemPendencias={setTemPendencias}/>;
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
  if(etapa==="Direcionamento"){
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
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>setDestOne(it.id||i,"interno")}
                        style={{background:dest==="interno"?C.green:C.white,color:dest==="interno"?C.white:C.gray700,border:`1.5px solid ${dest==="interno"?C.green:C.gray300}`,borderRadius:5,padding:"4px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:600}}>
                        Interno
                      </button>
                      <button onClick={()=>setDestOne(it.id||i,"externo")}
                        style={{background:dest==="externo"?C.purple:C.white,color:dest==="externo"?C.white:C.gray700,border:`1.5px solid ${dest==="externo"?C.purple:C.gray300}`,borderRadius:5,padding:"4px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:600}}>
                        Externo
                      </button>
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
                itensDir.map((it,i)=>[it.id||it.sku,(itemDest[it.id||i]||"")])
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
        {/* Upload */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Arquivo</label>
          <div style={{border:`2px dashed ${uploadFile?C.green:C.gray200}`,borderRadius:8,padding:"28px 20px",textAlign:"center",background:uploadFile?C.green+"06":C.gray50,cursor:"pointer",transition:"all 0.2s"}}
            onClick={()=>document.getElementById("upload-input").click()}
            onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.red;}}
            onDragLeave={e=>e.currentTarget.style.borderColor=uploadFile?C.green:C.gray200}
            onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){setUploadFile(f);setUploadName(f.name);}e.currentTarget.style.borderColor=C.green;}}>
            <input id="upload-input" type="file" accept={config.accept} style={{display:"none"}}
              onChange={e=>{const f=e.target.files[0];if(f){setUploadFile(f);setUploadName(f.name);}}}/>
            {uploadFile
              ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <Ic n="check" s={20} c={C.green}/>
                  <div style={{textAlign:"left"}}>
                    <div style={{...F.body,fontWeight:700,fontSize:14,color:C.green}}>{uploadName}</div>
                    <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>Arquivo selecionado · clique para trocar</div>
                  </div>
                </div>
              :<div>
                  <Ic n="download" s={28} c={C.gray300} style={{margin:"0 auto 8px",display:"block"}}/>
                  <div style={{...F.body,fontSize:13,color:C.gray500}}>Clique ou arraste o arquivo aqui</div>
                  <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>Formatos aceitos: {config.accept}</div>
                </div>
            }
          </div>
        </div>
        {/* Observação */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações (opcional)</label>
          <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={3} placeholder="Informações relevantes sobre este arquivo..."
            style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <button onClick={async()=>{
            if(!uploadFile){alert("Anexe um arquivo antes de confirmar.");return;}
            setUploading(true);
            try{
              // Converte o arquivo em base64
              const base64=await new Promise((res,rej)=>{
                const r=new FileReader();
                r.onload=()=>res(r.result.split(",")[1]);
                r.onerror=rej;
                r.readAsDataURL(uploadFile);
              });
              const m=await onAction(order.id,"upload",{
                arquivo:uploadName,obs:obsText,
                fileBase64:base64,fileName:uploadName,
                propriedade:ETAPA_PROPRIEDADE[etapa],
              });
              setActionMsg(m||"");setActionDone(true);
            }catch(e){alert("Erro no upload: "+e.message);}
            finally{setUploading(false);}
          }}
          disabled={uploading}
          style={{background:uploading?"#ccc":uploadFile?C.red:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"11px 24px",cursor:uploadFile&&!uploading?"pointer":"not-allowed",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
          <Ic n="send" s={15} c={C.white}/> {uploading?"Enviando...":config.btn}
        </button>
      </div>
    );
  }

  // ── PÓS-VENDA / CS — Aprovação de amostra ─────────────────────────────────
  if(etapa==="Aprovação de Amostra Digital"||etapa==="Aprovação de Amostra Física"){
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
    const params=_orderLeve.posvendaId?"?posvenda="+_orderLeve.posvendaId
                :_orderLeve.bordadoId?"?bordado="+_orderLeve.bordadoId:null;
    if(!params){_setLoadingDet(false);return;}
    _setLoadingDet(true);
    apiFetch("/pedido-completo"+params).then(r=>{
      if(r&&r.success&&r.card)_setEnriched(normalizarCard(r.card,r.card.etapa));
    }).catch(()=>{}).finally(()=>_setLoadingDet(false));
  },[_orderLeve?.posvendaId,_orderLeve?.bordadoId]);
  // Mescla: dados leves sempre existem (vindo do snapshot); enriched preenche
  // items, historico, timeline, contato, etc, quando termina de carregar.
  // IMPORTANTE: preservamos os campos que o snapshot calculou (etapa, stageId,
  // pedidoLinx) sobre os do enriched — porque o snapshot já junta pós-venda +
  // bordado e sabe a etapa granular ("Programação", não "Em Processo de Bordado").
  const order=_enriched?{
    ..._enriched,
    etapa: _orderLeve.etapa,
    stageId: _orderLeve.stageId,
    stageIdAtual: _orderLeve.stageIdAtual,
    pedidoLinx: _orderLeve.pedidoLinx,
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
  }:_orderLeve;
  const ETAPAS_COM_ACAO=["Conferência e Direcionamento","Programação","Amostra Digital","Amostra Física","Aprovação de Amostra Digital","Aprovação de Amostra Física","Bordado Interno","Bordado Externo","Bordado Interno e Externo","Expedição","Análise de Frete"];
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
  const[motivoAguard,setMotivoAguard]=useState("");
  const[pedidoDep,setPedidoDep]=useState("");
  const[uploadFile,setUploadFile]=useState(null);
  const[uploadName,setUploadName]=useState("");
  const[obsText,setObsText]=useState("");
  const[actionDone,setActionDone]=useState(false);
  const[actionMsg,setActionMsg]=useState("");
  // Direcionamento local state — apenas itens COM bordado precisam de direcionamento.
  // Fallback (pedido legado sem a flag em nenhum item): usa todos os itens.
  const itensComBordado=order.items.filter(it=>it.bordado);
  const itensDirecionaveis=itensComBordado.length?itensComBordado:order.items;
  const skus=itensDirecionaveis.map(it=>it.sku);
  const itemKeys=itensDirecionaveis.map((it,i)=>it.id||i);
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
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexShrink:0}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{...F.title,fontSize:17,fontWeight:700,color:C.black}}>{idPedido(order)}</span>
              <ETag etapa={order.etapa}/>
              {order.houveAlteracaoForm&&<Tag label="⚠ Já houve alteração de formulário" color="#b45309"/>}
              {order.temBordado===false&&<Tag label="Sem bordado" color={C.gray600}/>}
              {(sla.st==="late"||sla.st==="risk"||sla.ft==="late"||sla.ft==="risk")&&<Tag label={sla.st==="late"||sla.ft==="late"?"Prazo vencido":"Em risco"} color={sla.st==="late"||sla.ft==="late"?C.red:C.amber}/>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,flexWrap:"wrap"}}>
              <BadgeSeparacao status={statusSepDoOrder(order)} qtdSep={order.qtdSeparada} qtdTot={order.qtdTotal} qtdItensSep={order.qtdItensSeparados} totalItens={order.totalItensSeparacao} size="lg"/>
            </div>
            <div style={{...F.body,fontSize:13,color:C.gray600,marginTop:6,fontWeight:600}}>{order.client}</div>
            <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:2}}>{order.vendedor}{order.etapa!=="Programação"?` · ${pecasDoCard(order)} peças · ${fmtR(order.valor)}`:""}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
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
            <button
              onClick={()=>imprimirPedido(order.vendasId||order.posvendaId)}
              title="Imprimir folha de separação"
              style={{background:C.white,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"7px 12px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,color:C.gray700,fontWeight:700,fontSize:12,...F.body}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.gray50;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
              <Ic n="print" s={14} c={C.gray700}/> Imprimir Pedido
            </button>
            <button onClick={onCloseSeguro} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="close" s={18} c={C.gray400}/></button>
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
              {[["Cliente",order.client],["CNPJ",order.cnpj],["Razão Social",order.razaoSocial],["Vendedor",order.vendedor],["Telefone",order.tel],["E-mail",order.email],["Valor",fmtR(order.valor)],["Condição de Pgto",order.condicaoPagamento],["Prazo Faturamento do Pedido", _loadingDet?"⏳ Carregando...":(dataVencimento(order)?fmtD(dataVencimento(order)):"A definir (sem amostra aprovada)")],["Entrada",fmtD(order.entradaAt)]].map(([k,v])=>(
                <div key={k} style={{background:C.gray50,borderRadius:6,padding:"10px 12px",border:`1px solid ${C.gray200}`}}>
                  <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
                  <div style={{...F.body,fontSize:13,fontWeight:600,color:_loadingDet&&(k==="Prazo Faturamento do Pedido")?C.gray400:C.black,wordBreak:"break-word",fontStyle:_loadingDet&&(k==="Prazo Faturamento do Pedido")?"italic":"normal"}}>{v}</div>
                </div>
              ))}
            </div>
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
                    {title==="Prazo Faturamento do Pedido"&&dataVencimento(order)&&<div style={{...F.body,fontSize:12,color:C.gray600,marginTop:6,fontWeight:600}}>{fmtD(dataVencimento(order))}</div>}
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
                      <td style={{padding:"8px 10px",color:C.gray500,...F.body,whiteSpace:"nowrap"}}>{t.who||"Sistema"}</td>
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
            {/* Arquivos de bordado anexados pelo vendedor */}
            <div>
              <SecH>Arquivos de Bordado</SecH>
              <ArquivosBox fileIds={order.arquivoBordado} emptyText="Nenhum arquivo de bordado anexado ao negócio."/>
            </div>
            {(order.arquivoDtfsilk&&order.arquivoDtfsilk.length>0)?<div>
              <SecH>Arquivos DTF / Silk</SecH>
              <ArquivosBox fileIds={order.arquivoDtfsilk} emptyText="Nenhum arquivo DTF/Silk."/>
            </div>:null}
            {/* Amostra digital aprovada */}
            <div>
              <SecH>Amostra Digital Aprovada</SecH>
              <ArquivosBox fileIds={order.arqAmostraDigital?String(order.arqAmostraDigital).split(";").filter(Boolean):[]} emptyText="Nenhuma amostra digital anexada ainda."/>
            </div>
            {/* Amostra física aprovada */}
            <div>
              <SecH>Amostra Física Aprovada</SecH>
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
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:560}}>
              <thead><tr style={{borderBottom:`2px solid ${C.gray200}`}}>
                {["SKU","Descrição","TAM","Qtd","Qtd Separada","Saldo","Bordado","Destino","Status"].map(hd=><th key={hd} style={{padding:"9px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body,textTransform:"uppercase",letterSpacing:"0.05em"}}>{hd}</th>)}
              </tr></thead>
              <tbody>{order.items.map((it,i)=>{
                const qtd=Number(it.qty||0);
                const qtdSep=Number(it.qtdSeparada!=null?it.qtdSeparada:0);
                const saldo=Math.max(0,qtd-qtdSep);
                const stSep=it.statusSeparacao||(qtdSep===0?"pendente":(qtdSep<qtd?"parcial":"completa"));
                const corSep=stSep==="completa"?C.green:stSep==="parcial"?C.amber:C.red;
                return(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
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
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body,color:corSep,verticalAlign:"top"}}>{qtdSep}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body,color:saldo>0?C.red:C.gray400,verticalAlign:"top"}}>{saldo>0?saldo:"—"}</td>
                  <td style={{padding:"9px 10px",verticalAlign:"top"}}>{it.bordado?<Tag label="Bordado" color={C.red}/>:<span style={{color:C.gray400}}>—</span>}</td>
                  <td style={{padding:"9px 10px",verticalAlign:"top"}}>{it.dest?<Tag label={it.dest==="interno"?"Interno":"Externo"} color={it.dest==="interno"?C.green:C.purple}/>:<span style={{color:C.gray400}}>—</span>}</td>
                  <td style={{padding:"9px 10px",verticalAlign:"top"}}><Tag label={
                    stSep==="completa" ? "Separado"
                    : stSep==="parcial" ? `Parcial (${qtdSep}/${qtd})`
                    : "Pendente"
                  } color={corSep}/></td>
                </tr>
                );
              })}</tbody>
              <tfoot><tr style={{borderTop:`2px solid ${C.gray200}`,background:C.gray50}}>
                <td colSpan={3} style={{padding:"9px 10px",fontWeight:700,fontSize:11,...F.body,color:C.gray500,textTransform:"uppercase"}}>Total</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body}}>{total}</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body,color:C.green}}>{order.items.reduce((s,i)=>s+Number(i.qtdSeparada||0),0)}</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body,color:C.red}}>{order.items.reduce((s,i)=>s+Math.max(0,Number(i.qty||0)-Number(i.qtdSeparada||0)),0)||"—"}</td>
                <td colSpan={3}/>
              </tr></tfoot>
            </table>
          </div>}
          {tab==="tl"&&<Timeline order={order}/>}
          {tab==="alteracao"&&<AlteracaoFormTab order={order} onAction={onAction} me={me}/>}
          {tab==="chat"&&<div style={{height:isMobile?380:420}}><Chat order={order} me={me} usuarios={usuarios}/></div>}
          {tab==="acao"&&<AcaoTab
            order={order} me={me}
            uploadFile={uploadFile} setUploadFile={setUploadFile}
            uploadName={uploadName} setUploadName={setUploadName}
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
      {/* Modal de motivo — Aguardando Outro Pedido */}
      {modalAguard&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1002,padding:20}} onClick={()=>setModalAguard(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:10,padding:24,maxWidth:500,width:"100%",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
          <div style={{...F.title,fontSize:16,fontWeight:800,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
            <Ic n="clock" s={18} c={C.blue}/> Aguardando Outro Pedido
          </div>
          <div style={{...F.body,fontSize:13,color:C.gray600,marginBottom:16,lineHeight:1.5}}>
            O pedido sai da etapa <strong>{order.etapa}</strong> e vai pra aba "Aguardando Outro Pedido". Use quando o vendedor pediu pra faturar junto com outro pedido ou aguardar material atrelado.
          </div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Nº do pedido dependência (obrigatório)</label>
          <input value={pedidoDep} onChange={e=>setPedidoDep(e.target.value)} placeholder="Nº Linx ou ID HubSpot"
            style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",outline:"none",boxSizing:"border-box",marginBottom:12}}/>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",display:"block",marginBottom:6}}>Motivo (obrigatório)</label>
          <textarea value={motivoAguard} onChange={e=>setMotivoAguard(e.target.value)} rows={4}
            placeholder="Ex: aguardar faturamento junto com o pedido X; aguardar chegada de material do pedido Y..."
            style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",boxSizing:"border-box",resize:"vertical",marginBottom:14}}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={()=>{setModalAguard(false);setMotivoAguard("");setPedidoDep("");}} style={{background:C.white,color:C.gray600,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 14px",...F.body,fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
            <button onClick={async()=>{
              if(!pedidoDep.trim()){alert("Nº do pedido dependência obrigatório."); return;}
              if(!motivoAguard.trim()){alert("Motivo obrigatório."); return;}
              try{
                const r=await apiFetch("/aguardando-outro-pedido/entrar","POST",{
                  dealId: order.posvendaId || order.bordadoId,
                  pedidoDependencia: pedidoDep.trim(),
                  motivo: motivoAguard.trim(),
                  ctx: { executor: me?.nome || "Usuário SGP" },
                });
                if(r.success){ setModalAguard(false); setMotivoAguard(""); setPedidoDep(""); onClose(); }
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
          <div style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{idPedido(order)}</div>
          <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{order.client}</div>
        </div>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
          <ETag etapa={order.etapa}/>
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
          {!venc?(order.temBordado===false?"⏳ Calculando prazo...":"Aguardando aprovação de amostra"):vencido?`Vencido em ${fmtDS(venc)}`:`Vence em ${fmtDS(venc)}`}
        </span>
      </div>}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <SLABar pct={sla.pct} st={sla.st}/>
        {!ehProg&&<span style={{...F.body,fontSize:10,color:sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.green,fontWeight:700,flexShrink:0}}>{sla.hrs.toFixed(0)}h/{sla.sla}h</span>}
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
    if(o.dataVencimento&&new Date(o.dataVencimento).getTime()<agora) idsAtrasados.add(o.vendasId||o.id);
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
function ConferenciaSeparacao({orders, onOpen, slaCfg, user}) {
  const [pedidos, setPedidos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [confirming, setConfirming] = useState({});
  const [confirmed, setConfirmed] = useState({});

  const carregar = () => {
    setLoading(true);
    setLoadError(null);
    // Usa o snapshot-aberto (otimizado com cache 30s + batches) ao invés do
    // /conferencia-separacao antigo — evita 10+ subrequests por pedido.
    apiFetch("/snapshot-aberto")
      .then(res => {
        if (res.success) {
          const items = res.porEtapa?.["Conferência Separação"]?.items || [];
          setPedidos(items.map(o => normalizarCard(o, "Conferência Separação")));
        } else {
          setLoadError(res.error || "Erro desconhecido");
        }
      })
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { carregar(); }, []);

  const confirmarConferencia = async (o) => {
    if (!o.posvendaId) { alert("Pedido sem negócio de Pós-venda."); return; }
    setConfirming(prev => ({...prev, [o.id]: true}));
    try {
      const r = await apiFetch("/conferir-separacao/" + o.posvendaId, "POST", {
        ctx: { executor: user?.nome || "Usuário SGP" },
      });
      if (r.success) {
        setConfirmed(prev => ({...prev, [o.id]: r.proximaEtapa}));
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

  const lista = pedidos || [];

  return (
    <div style={{padding:20}}>
      <PageH title="Conferência Separação" sub="WMS bipou. Aguardando conferência manual antes de seguir." onRefresh={carregar} refreshing={loading}/>
      {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#0369a1"+"0e",border:`1px solid #0369a128`,borderRadius:8,...F.body,fontSize:13,color:"#0369a1"}}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        Carregando pedidos...
      </div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {loadError}</div>}
      {!loading&&!loadError&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:C.green+"0e",border:`1px solid ${C.green}28`,borderRadius:7,...F.body,fontSize:12,color:C.green,marginBottom:12}}>
        <Ic n="check" s={13} c={C.green}/> {lista.length} pedido{lista.length!==1?"s":""} aguardando conferência
      </div>}
      {!loading&&lista.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhum pedido aguardando conferência.</div>}
      {lista.map(o => {
        const isConfirmed = confirmed[o.id];
        const isConfirming = confirming[o.id];
        const sla = getSLA(o, slaCfg);
        return (
          <Card key={o.id} style={{marginBottom:14, borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:"#0369a1"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span>
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
                  <strong style={{color:C.gray700}}>{o.temBordado===false ? "Expedição" : "Conferência e Direcionamento"}</strong>
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

  const carregarDir=()=>{
    setLoading(true);
    setLoadError(null);
    setConfirmed({});
    setDestMap({});
    setSel({});
    apiFetch("/capacidade-lotacao").then(r=>{ if(r.success)setCapLot({capacidade:r.capacidade||{},lotacao:r.lotacao||{}}); }).catch(()=>{});
    apiFetch("/conferencia-direcionamento")
      .then(res=>{
        if(res.success){
          const converted=res.data.map(o=>({
            id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
            client:o.client,cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",
            tel:o.telefone||"",email:o.email||"",
            obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
            condicaoPagamento:o.condicaoPagamento||"",vendedor:o.vendedor,valor:o.valor,
            prazoFinal:o.prazoFinal||new Date(Date.now()+7*86400000).toISOString(),
            etapa:"Conferência e Direcionamento",amOk:o.amostrasAprovada,sepOk:o.separacaoCompleta,
            entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
            alertas:o.alertas||[],concluido:false,
            bordado:{pts:0,cores:[],arq:"",arqOk:false,amDig:[],amDigObs:"",amFis:[],amFisObs:""},
            arquivoBordado:o.arquivoBordado||[],arquivoDtfsilk:o.arquivoDtfsilk||[],
            historico:o.historico||[],
            houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
            temBordado:o.temBordado!==false,dataVencimento:o.dataVencimento||null,
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
  const pendentes=activeOrders.filter(o=>!o.amOk&&!o.concluido);
  const prontos=activeOrders.filter(o=>o.amOk&&o.etapa==="Direcionamento"&&!o.concluido);
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
      <PainelLotacao capLot={capLot} destinos={["interno","bordadel","mg_bordados","outros"]} titulo="Capacidade x lotação — usada para a sugestão"/>
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
      {/* Pedidos aguardando amostra — caixa recolhível */}
      {pendentes.length>0&&(
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
      <SecH>Prontos para direcionar — {prontos.length} pedido{prontos.length!==1?"s":""}</SecH>
      {prontos.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhum pedido aguardando direcionamento.</div>}
      {prontos.map(o=>{
        // Pedidos SEM bordado: card simplificado com botão "Conferido" só
        if (o.temBordado === false) {
          const isConfirmed = confirmed[o.id];
          const sla = getSLA(o, slaCfg);
          return (
            <Card key={o.id} style={{marginBottom:14,borderLeft:`3px solid ${C.teal}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span>
                    <Tag label="Sem bordado" color={C.gray600}/>
                    <BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>
                    {sla.st!=="ok"&&<Tag label={sla.st==="late"?"Etapa atrasada":"Etapa em risco"} color={sla.st==="late"?C.red:C.amber}/>}
                  </div>
                  <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>
                    {o.client} · {fmtR(o.valor)} · {pecasDoCard(o)} peças
                  </div>
                  <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:6}}>
                    Este pedido não tem bordado. Confira fisicamente e envie pra Expedição.
                  </div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen(o)}/>
                  <button
                    onClick={async ()=>{
                      if (isConfirmed) return;
                      try {
                        const r = await apiFetch("/apenas-conferido/" + o.posvendaId, "POST", {
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
                      background: isConfirmed ? C.gray300 : C.teal,
                      color: C.white, border: "none", borderRadius: 6,
                      padding: "10px 20px", cursor: isConfirmed ? "default" : "pointer",
                      fontWeight: 700, fontSize: 13, ...F.body,
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}>
                    <Ic n="check" s={14} c={C.white}/> {isConfirmed ? "Enviado ✓" : "Conferido — enviar para Expedição"}
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
          <Card key={o.id} style={{marginBottom:14,borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:STAGE_COLOR[o.etapa]||C.gray300}`}}>
            {/* Cabeçalho do pedido */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8,alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{idPedido(o)}</span>
                  <ETag etapa={o.etapa}/>
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
const ABERTO_ETAPAS=[
  {nome:"Em Separação",endpoint:"/em-separacao"},
  {nome:"Conferência Separação",endpoint:"/conferencia-separacao"},
  {nome:"Conferência e Direcionamento",endpoint:"/conferencia-direcionamento"},
  {nome:"Programação",endpoint:"/programacao"},
  {nome:"Amostra Digital",endpoint:"/amostra-digital"},
  {nome:"Aprovação de Amostra Digital",endpoint:"/aprovacao-amostra-digital"},
  {nome:"Amostra Física",endpoint:"/amostra-fisica"},
  {nome:"Aprovação de Amostra Física",endpoint:"/aprovacao-amostra-fisica"},
  {nome:"Bordado Interno",endpoint:"/bordado-interno"},
  {nome:"Bordado Externo",endpoint:"/bordado-externo"},
  {nome:"Expedição",endpoint:"/expedicao"},
  {nome:"Análise de Frete",endpoint:"/analise-frete"},
  {nome:"Pendência Comercial",endpoint:"/pendencia-comercial"},
  {nome:"Aguardando Outro Pedido",endpoint:"/aguardando-pedido"},
];

// Painel de capacidade x lotação (peças com bordado em aberto) por destino
function PainelLotacao({capLot,destinos,titulo}){
  const cap=capLot.capacidade||{}, lot=capLot.lotacao||{};
  const LBL={interno:"Interno",bordadel:"Bordadel",mg_bordados:"MG Bordados",outros:"Outros"};
  const COR={interno:C.green,bordadel:C.red,mg_bordados:"#7c3aed",outros:C.amber};
  return(
    <Card>
      <SecH>{titulo||"Capacidade x lotação (peças com bordado em aberto)"}</SecH>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
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
    if(q&&!((o.client||"").toLowerCase().includes(q)||String(o.id||"").toLowerCase().includes(q)||String(o.pedidoLinx||"").toLowerCase().includes(q)||String(o.vendasId||"").includes(q)))return false;
    return true;
  });
  const agora=Date.now();
  const isAtrasado=o=>{const v=dataVencimento(o);return v&&new Date(v).getTime()<agora;};
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
  const porEtapa=ABERTO_ETAPAS.map(e=>{
    const ords=ordenarPorPrioridade(abertoFiltrado.filter(o=>o.etapa===e.nome));
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
  const isAtrasado=o=>{const v=dataVencimento(o);return v&&new Date(v).getTime()<agora;};
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
  const porEtapa=ABERTO_ETAPAS.map(e=>({
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
  const isAtrasado=o=>o.dataVencimento&&new Date(o.dataVencimento).getTime()<agora;
  const stats=ABERTO_ETAPAS.map(e=>{
    const ords=ordenarPorPrioridade((aberto||[]).filter(o=>o.etapa===e.nome));
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
function SLAConfig({slaCfg,onSave}){
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

      {/* Manutenção — ações administrativas */}
      <Card>
        <SecH>Manutenção</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:16}}>Ações administrativas para corrigir problemas de dados no HubSpot.</div>
        <BackfillLinxBtn/>
      </Card>

      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <Btn label={saving?"Salvando...":"Salvar configurações"} icon="check" onClick={save}/>
        {saved&&<span style={{...F.body,fontSize:13,color:C.green,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Ic n="check" s={14} c={C.green}/>Salvo!</span>}
        {loading&&<span style={{...F.body,fontSize:12,color:C.gray400}}>Carregando config...</span>}
      </div>
    </div>
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

// ─── FILA GENÉRICA ────────────────────────────────────────────────────────────
function Fila({title,etapa,orders,onOpen,actionLabel,actionColor=C.green,slaCfg,endpoint,finalizado,filtroBordador,setFiltroBordador,topoExtra,subTabsReprog}){
  const [busca,setBusca]=useState("");
  const [filtroSLA,setFiltroSLA]=useState("todos"); // todos | atrasados | risco | ok
  const [subTab,setSubTab]=useState("normal"); // normal | reprogramacao

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

  // Filtro por bordador externo (só usado na aba Externo)
  if(filtroBordador&&filtroBordador!=="todos"){
    mine=mine.filter(o=>(o.items||[]).some(it=>(it.bordador||"")===filtroBordador));
  }

  // Filtro por sub-tab (só ativa quando subTabsReprog=true)
  if(subTabsReprog){
    if(subTab==="reprogramacao") mine=mine.filter(o=>o.reprogramacao===true);
    else mine=mine.filter(o=>!o.reprogramacao);
  }

  // Ordena por PRIORIDADE (data de vencimento mais próxima primeiro)
  mine=ordenarPorPrioridade(mine);

  // Contadores para os chips de filtro
  const all=source.filter(o=>o.etapa===etapa&&!o.concluido);
  const nLate=all.filter(o=>getSLA(o,slaCfg,etapa).st==="late").length;
  const nRisk=all.filter(o=>getSLA(o,slaCfg,etapa).st==="risk").length;
  const nReprog=all.filter(o=>o.reprogramacao===true).length;
  const nNormal=all.filter(o=>!o.reprogramacao).length;

  const FilterChip=({id,label,count,color})=>(
    <button onClick={()=>setFiltroSLA(id)}
      style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:7,border:`1.5px solid ${filtroSLA===id?(color||C.red):C.gray200}`,background:filtroSLA===id?(color||C.red)+"0e":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:filtroSLA===id?700:500,color:filtroSLA===id?(color||C.red):C.gray600,whiteSpace:"nowrap"}}>
      {label}{count!==undefined&&<span style={{background:filtroSLA===id?(color||C.red):C.gray200,color:filtroSLA===id?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{count}</span>}
    </button>
  );

  return(
    <div style={{padding:24}}>
      <PageH title={title} sub={`${all.length} pedido${all.length!==1?"s":""} ${finalizado?"concluído"+(all.length!==1?"s":""):"nesta etapa"}`} onRefresh={carregar} refreshing={loading}/>

      {topoExtra}

      {/* Sub-abas estilo Chrome: Normal | Reprogramação (só nas Amostras) */}
      {subTabsReprog && <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:`1.5px solid ${C.gray200}`,alignItems:"flex-end"}}>
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
        <div onClick={()=>setSubTab("reprogramacao")}
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
          <span>↻</span> Reprogramação
          {nReprog>0 && <span style={{
            background:"#f97316",color:C.white,
            padding:"2px 8px",borderRadius:10,
            fontSize:11,fontWeight:800,
            minWidth:18,textAlign:"center",
            boxShadow:"0 0 0 2px "+C.white,
          }}>{nReprog}</span>}
        </div>
      </div>}

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
            <Card key={o.id} onClick={()=>onOpen({...o,_etapaOrigem:etapa})}
              style={{marginBottom:10,borderLeft:`4px solid ${ac}`,cursor:"pointer",transition:"box-shadow 0.15s,transform 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="";e.currentTarget.style.transform="";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
                    <span style={{...F.body,fontWeight:700,fontSize:14}}>{idPedido(o)}</span>
                    <BadgeSeparacao status={o.statusSeparacao} qtdSep={o.qtdSeparada} qtdTot={o.qtdTotal} qtdItensSep={o.qtdItensSeparados} totalItens={o.totalItensSeparacao} size="sm"/>
                    {o.reprogramacao&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#f97316",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>↻ (ALTERAÇÃO)</span>}
                    {o.houveAlteracaoForm&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#b45309",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>⚠ ALTERAÇÃO DE FORMULÁRIO</span>}
                    {o.temBordado===false&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.gray600,color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>SEM BORDADO</span>}
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
                  <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:6}}>{etapa==="Programação"
                    ? (()=>{const n=(o.bordadosJson||[]).filter(b=>/~prog/i.test(b.fileName||"")).length||(o.bordadosJson||[]).length; return `${n} programaç${n===1?"ão":"ões"}`;})()
                    : `${fmtR(o.valor)} · ${totalSKUs} SKU${totalSKUs!==1?"s":""} · ${totalPecas} peça${totalPecas!==1?"s":""}`}</div>
                  {!finalizado&&<div style={{...F.body,fontSize:11,color:o.dataVencimento?(new Date(o.dataVencimento)<new Date()?C.red:C.gray600):C.gray400,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                    <Ic n="clock" s={11} c={o.dataVencimento?(new Date(o.dataVencimento)<new Date()?C.red:C.gray500):C.gray300}/>
                    {o.dataVencimento?<>Vence em {fmtDS(o.dataVencimento)}</>:"Vencimento ainda não definido"}
                  </div>}
                  {!finalizado&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,maxWidth:340}}>
                    <SLABar pct={sla.pct} st={sla.st}/>
                    <span style={{...F.body,fontSize:10,color:slaColor,fontWeight:700,flexShrink:0}}>{sla.hrs.toFixed(0)}h/{sla.sla}h</span>
                  </div>}
                  {o.alertas.length>0&&<div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>{o.alertas.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,...F.body,fontSize:11,color:"#92400e",fontWeight:600}}><Ic n="warn" s={11} c={C.amber}/>{a}</div>)}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,color:C.gray400}}>
                  <span style={{...F.body,fontSize:12,color:C.gray400}}>Abrir</span>
                  <Ic n="chevR" s={16} c={C.gray400}/>
                </div>
              </div>
            </Card>
          );
        })
      }
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

  const GRUPOS=["Principal","Análise","Separação","Amostra","Operação","Outros","Cadastros","Sistema"];

  const toggleMod=(m)=>setForm(f=>({...f,modulos:f.modulos.includes(m)?f.modulos.filter(x=>x!==m):[...f.modulos,m]}));
  const toggleGrupo=(grupo)=>{
    const ids=NAV_ITEMS.filter(n=>n.grupo===grupo).map(n=>n.id);
    const allOn=ids.every(id=>form.modulos.includes(id));
    setForm(f=>({...f,modulos:allOn?f.modulos.filter(m=>!ids.includes(m)):[...new Set([...f.modulos,...ids])]}));
  };

  const abrirNovo=()=>{setEditId(null);setForm({nome:"",email:"",senha:"",modulos:[]});setShow(true);};
  const abrirEdit=(u)=>{setEditId(u.id);setForm({nome:u.nome,email:u.email,senha:"",modulos:u.modulos||[]});setShow(true);};

  const salvar=()=>{
    if(!form.nome||!form.email||(!editId&&!form.senha)){alert("Preencha nome, e-mail e senha.");return;}
    const req = editId
      ? apiFetch(`/usuarios/${encodeURIComponent(editId)}`,"PATCH",{nome:form.nome,modulos:form.modulos,...(form.senha?{senha:form.senha}:{})})
      : apiFetch("/usuarios","POST",{nome:form.nome,email:form.email,senha:form.senha,modulos:form.modulos});
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

        {/* Seleção de módulos por grupo */}
        <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Módulos com acesso</div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
          {GRUPOS.map(grupo=>{
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

        <div style={{display:"flex",gap:8}}>
          <Btn label={editId?"Salvar alterações":"Criar acesso"} icon="check" variant="success" onClick={salvar}/>
          <Btn label="Cancelar" variant="secondary" onClick={()=>setShow(false)}/>
        </div>
      </Card>}

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
                <td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av ini={ini(u.nome)} size={28}/><span style={{...F.body,fontWeight:600,color:C.black}}>{u.nome}</span></div></td>
                <td style={{padding:"11px 16px",...F.body,color:C.gray500,fontSize:12}}>{u.email}</td>
                <td style={{padding:"11px 16px"}}><Tag label={`${(u.modulos||[]).length} módulo${(u.modulos||[]).length!==1?"s":""}`} color={C.gray600}/></td>
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
          onLogin(u);
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
function BordadoExternoPage({orders,onOpen,slaCfg}){
  const [capLot,setCapLot]=useState({capacidade:{},lotacao:{}});
  const [filtro,setFiltro]=useState("todos");
  useEffect(()=>{
    const load=()=>apiFetch("/capacidade-lotacao").then(r=>{if(r.success)setCapLot({capacidade:r.capacidade||{},lotacao:r.lotacao||{}});}).catch(()=>{});
    load();
    _refreshListeners.push(load);
    return ()=>{_refreshListeners=_refreshListeners.filter(f=>f!==load);};
  },[]);
  const FILT=[["todos","Todos",C.gray600],["bordadel","Bordadel",C.red],["mg_bordados","MG Bordados","#7c3aed"],["outros","Outros",C.amber]];
  const topoExtra=(
    <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:12}}>
      <PainelLotacao capLot={capLot} destinos={["bordadel","mg_bordados","outros"]} titulo="Lotação dos bordadores externos (peças em aberto)"/>
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
  const totalPecas=(o.produtos||[]).reduce((s,p)=>s+(p.total||0),0);
  const totalSeparado=(o.produtos||[]).reduce((s,p)=>s+(p.totalSeparado||0),0);
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

      {/* Cliente */}
      <div className="produto-row" style={{background:"#f0f0f0",border:"1px solid #c0c0c0",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
        <span style={{...F.body,fontSize:10,color:"#333",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Cliente: </span>
        <span style={{...F.body,fontSize:14,fontWeight:700,color:"#000"}}>{o.cliente||"—"}</span>
        {(o.cnpj||o.endereco)&&<div style={{...F.body,fontSize:11,color:"#222",marginTop:2,fontWeight:600}}>{o.cnpj&&`CNPJ: ${o.cnpj}`}{o.endereco?(o.cnpj?" · ":"")+o.endereco:""}</div>}
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

      {/* Bordados */}
      {(o.bordados||[]).length>0 && <>
        <div style={{...F.title,fontSize:12,fontWeight:700,color:"#333",letterSpacing:"0.1em",textTransform:"uppercase",margin:"16px 0 8px",borderBottom:"1px solid #c0c0c0",paddingBottom:4}}>Bordados ({o.bordados.length})</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {o.bordados.map((b,i)=>(
            <div key={i} className="produto-row" style={{border:"1px solid #555",borderRadius:8,padding:8,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:56,height:56,border:"1px solid #c0c0c0",borderRadius:6,background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                {b.fileUrl&&ehImg(b.fileName)
                  ?<img src={b.fileUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                  :<span style={{fontSize:20,color:"#555",fontWeight:700}}>🧵</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{...F.title,fontSize:12,fontWeight:800,lineHeight:1.2,wordBreak:"break-word",color:"#000"}}>{limpaNome(b.fileName)}</div>
                {(b.productName||b.positionLabel)&&<div style={{...F.body,fontSize:10.5,color:"#222",fontWeight:700,marginTop:2}}>
                  {[b.productName,b.positionLabel].filter(Boolean).join(" · ")}
                </div>}
                {b.obs_programacao&&<div style={{marginTop:5,background:AMBER.bg,borderLeft:`4px solid ${AMBER.bd}`,borderRadius:4,padding:"5px 8px",...F.body,fontSize:11,lineHeight:1.35,color:"#000",fontWeight:600,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                  <span style={{...F.title,fontSize:10,color:AMBER.cor,fontWeight:800,letterSpacing:"0.02em"}}>[PROGRAMAÇÃO]</span> {b.obs_programacao}
                </div>}
                {b.obs_bordado&&<div style={{marginTop:5,background:AMBER.bg,borderLeft:`4px solid ${AMBER.bd}`,borderRadius:4,padding:"5px 8px",...F.body,fontSize:11,lineHeight:1.35,color:"#000",fontWeight:600,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                  <span style={{...F.title,fontSize:10,color:AMBER.cor,fontWeight:800,letterSpacing:"0.02em"}}>[BORDADO]</span> {b.obs_bordado}
                </div>}
              </div>
            </div>
          ))}
        </div>
      </>}

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
        {o.valorTotal>0&&<span style={{color:"#7a0007",fontSize:15}}>Valor total: <strong>{fmtR(o.valorTotal)}</strong></span>}
      </div>
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
function TituloCard({texto,oq,como,extra}){
  return <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
    <span style={{...F.title,fontSize:14,fontWeight:600}}>{texto}</span>
    {oq&&<Ajuda oq={oq} como={como}/>}
    {extra&&<span style={{marginLeft:"auto",...F.body,fontSize:11,color:C.gray500,fontWeight:600}}>{extra}</span>}
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
    <div style={{padding:isMobile?14:"18px 22px",maxWidth:1180,margin:"0 auto"}}>
      <div style={{background:C.black,color:"#fff",borderRadius:16,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div><div style={{...F.title,fontSize:11,letterSpacing:"0.15em",color:"#c9a36b",fontWeight:600}}>SGP · CITEROL</div>
          <h2 style={{...F.title,fontSize:"clamp(22px,2.4vw,32px)",margin:"4px 0 0"}}>GESTÃO À VISTA</h2>
          <div style={{...F.body,fontSize:12,color:"#b9b6b0",marginTop:4}}>Pedidos em aberto · atualiza sozinho</div></div>
        <div style={{textAlign:"right"}}><div style={{...F.title,fontSize:"clamp(24px,3vw,40px)",lineHeight:1}}>{hora}</div>
          <div style={{...F.body,fontSize:12,color:"#b9b6b0",marginTop:4}}>{DIAS[ag.getDay()]}, {ag.getDate()} {MES[ag.getMonth()]}</div></div>
      </div>
      <EstadoCarga loading={loading&&!d} erro={erro&&!d} onRetry={carregar}/>
      {d&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <TileGV cor={C.red} sombra="0 8px 24px #9E0B0F40" lab="Em atraso" num={d.atrasados} sub={`${pAtr}% dos pedidos em aberto`}
            oq="Pedidos em aberto cujo vencimento já passou." como="Não finalizados com vencimento anterior a hoje."/>
          <TileGV cor={C.green} lab="No prazo" num={d.noPrazo} sub={`${pPz}% dos pedidos em aberto`}
            oq="Pedidos em aberto dentro do prazo." como="Não finalizados com vencimento ≥ hoje."/>
        </div>
        <div style={{...cardBox,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:9,...F.title,fontSize:12.5,fontWeight:600,color:C.gray600}}>
            <span>SAÚDE DO PRAZO</span><span style={{color:C.gray500}}>meta: 90% no prazo</span></div>
          <div style={{display:"flex",height:28,borderRadius:8,overflow:"hidden",...F.title,fontWeight:600,fontSize:13,color:"#fff"}}>
            <div style={{background:C.green,width:pPz+"%",display:"flex",alignItems:"center",paddingLeft:12,minWidth:0}}>{pPz}% no prazo</div>
            <div style={{background:C.red,width:pAtr+"%",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:12,minWidth:0}}>{pAtr}%</div>
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
            <TituloCard texto="Onde estão os atrasados" extra={d.atrasados+" atrasados"}/>
            {d.porEtapa.length? d.porEtapa.map((s,i)=>{const lw=s.tot?s.late/s.tot*100:0;return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:9,margin:"8px 0"}}>
                <span style={{flex:"0 0 110px",...F.body,fontSize:12,fontWeight:600,color:C.gray700}}>{s.nm}</span>
                <span style={{flex:1,height:18,background:C.gray100,borderRadius:5,overflow:"hidden",display:"flex",width:(s.tot/maxTot*100)+"%"}}>
                  <span style={{height:"100%",width:(100-lw)+"%",background:"#c3c8bb"}}/><span style={{height:"100%",width:lw+"%",background:C.red}}/></span>
                <span style={{flex:"0 0 64px",textAlign:"right",...F.title,fontWeight:600,fontSize:12.5}}>{s.tot}{s.late?<b style={{color:C.red}}> · {s.late}</b>:null}</span>
              </div>);}):<Vazio/>}
          </div>
          <div style={cardBox}>
            <TituloCard texto="Mais atrasados" extra="resolver primeiro"/>
            {d.maisAtrasados.length? d.maisAtrasados.map((o,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 0",borderBottom:`1px solid ${C.gray100}`}}>
                <span style={{...F.title,fontWeight:600,fontSize:13.5}}>{idPedido(o)}</span>
                <span style={{flex:1,minWidth:0}}><span style={{display:"block",...F.body,fontSize:13,fontWeight:600,color:C.gray700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.cli}</span>
                  <span style={{...F.body,fontSize:11,color:C.gray500}}>{o.et}</span></span>
                <span style={{...F.title,fontWeight:600,fontSize:12,padding:"4px 10px",borderRadius:20,background:"#9E0B0F14",color:C.red,whiteSpace:"nowrap"}}>{o.dias} {o.dias===1?"dia":"dias"}</span>
              </div>)):<div style={{...F.body,fontSize:12,color:C.gray500,padding:"12px 0"}}>Nenhum pedido atrasado. 🎉</div>}
          </div>
        </div>
      </>}
    </div>
  );
}
function TileGV({cor,sombra,lab,num,sub,oq,como}){
  return <div style={{borderRadius:18,padding:"20px 22px",background:cor,color:"#fff",boxShadow:sombra||"none"}}>
    <div style={{...F.title,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:"clamp(14px,1.4vw,18px)",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>{lab}
      <span style={{filter:"invert(1)"}}><Ajuda oq={oq} como={como}/></span></div>
    <div style={{...F.title,fontWeight:700,lineHeight:.92,marginTop:6,fontSize:"clamp(54px,6.5vw,96px)"}}>{num}</div>
    <div style={{...F.body,fontSize:"clamp(12px,1vw,15px)",marginTop:7,fontWeight:600,opacity:.93}}>{sub}</div>
  </div>;
}
function MiniGV({lab,num,sub,cor,oq,como}){
  return <div style={{...cardBox,...(cor===C.red?{borderColor:"#9E0B0F33",background:"linear-gradient(180deg,#fff,#fdf4f4)"}:{})}}>
    <div style={{...F.title,textTransform:"uppercase",letterSpacing:"0.05em",fontSize:11,fontWeight:600,color:C.gray500,display:"flex",gap:5,alignItems:"center"}}>{lab}{oq&&<Ajuda oq={oq} como={como}/>}</div>
    <div style={{...F.title,fontSize:"clamp(28px,3.2vw,44px)",fontWeight:700,lineHeight:1,marginTop:5,color:cor||C.black}}>{num}</div>
    <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:3,fontWeight:600}}>{sub}</div>
  </div>;
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
          <KpiR lab="Em risco" val={d.total} oq="Pedidos no prazo, mas ameaçados por etapas atrasadas." como="Folga = dias até o vencimento − tempo previsto do que falta. Folga baixa entra na lista."/>
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
                <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:4,fontWeight:600}}>vence em {o.buffer} {o.buffer===1?"dia":"dias"}</div>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"11px 0 9px"}}>
              {o.slips.length? o.slips.map((s,i)=><span key={i} style={{...F.body,fontSize:11.5,fontWeight:600,background:"#9E0B0F14",color:C.red,borderRadius:6,padding:"3px 8px"}}>{s.nm} +{_f1(s.d)}d</span>)
                : <span style={{...F.body,fontSize:11.5,fontWeight:600,background:C.gray100,color:C.gray500,borderRadius:6,padding:"3px 8px"}}>buffer apertado</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:10,borderTop:`1px solid ${C.gray100}`,...F.body,fontSize:12.5,color:C.gray700}}>
              <span style={{width:18,height:18,borderRadius:"50%",background:o.atrasoAcum>=o.buffer?C.red:C.amber,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",...F.title,fontSize:12,fontWeight:700,flex:"0 0 auto"}}>{o.atrasoAcum>=o.buffer?"!":"~"}</span>
              <span>{o.atrasoAcum>0?<>Já acumulou <b>{_f1(o.atrasoAcum)}d</b> de atraso nas etapas, com <b>{o.buffer}d</b> de prazo.</>:<>Folga apertada: vence em <b>{o.buffer}d</b>.</>}</span>
              <span style={{marginLeft:"auto",...F.body,fontSize:11,color:C.gray500,fontWeight:600,whiteSpace:"nowrap"}}>↳ {(o.etapa||"").indexOf("Bordado")>=0?"priorizar no bordado":"acompanhar"}</span>
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
  const doLogin=(u)=>{
    try{sessionStorage.setItem("sgp_user",JSON.stringify(u));}catch{}
    setUser(u);
    // Se o usuário entrou direto numa URL com hash (#funil, etc), respeita
    if (!(typeof window !== "undefined" && window.location.hash && window.location.hash.length > 1)) {
      setPage("demandas");
    }
  };
  const doLogout=()=>{
    try{sessionStorage.removeItem("sgp_user");}catch{}
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
    const t=setInterval(()=>{carregarNotifs();carregarUsuarios();},30000);
    return ()=>clearInterval(t);
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

      // ── UPLOAD (Programação, Amostra Digital, Amostra Física) ──────────────────
      else if(tipo==="upload"){
        const nextMap={
          "Programação":"Amostra Digital",
          "Amostra Digital":"Aprovação de Amostra Digital",
          "Amostra Física":"Aprovação de Amostra Física",
        };
        const next=nextMap[o.etapa]||o.etapa;
        if(!bordadoId){ alert("Pedido sem negócio de Bordado associado."); return; }
        if(!payload.fileBase64||!payload.propriedade){ alert("Arquivo ou propriedade ausente."); return; }
        const res=await apiFetch(`/upload-etapa/${bordadoId}`,"POST",{
          propriedade:payload.propriedade,
          propMotivo:ETAPA_PROP_MOTIVO[o.etapa]||"",
          fileBase64:payload.fileBase64,
          fileName:payload.fileName,
          sku:payload.sku||o.items?.find(it=>it.bordado)?.sku||"",
          novaEtapa:ETAPA_STAGE_ID[next],
          nota:`${o.etapa} → ${next} (arquivo: ${payload.fileName})`,
          ctx,
        });
        if(res.error) throw new Error(res.error);
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
          propriedade:ETAPA_PROPRIEDADE[o.etapa],
          propMotivo:ETAPA_PROP_MOTIVO[o.etapa]||"",
          novaEtapa:ETAPA_STAGE_ID[next],
          nota:`${o.etapa} → ${next}`,
          ctx,
        });
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

      // ── REPROVAR AMOSTRA (limpa arquivo + volta etapa) ─────────────────────────
      else if(tipo==="reprovar_amostra"){
        // Regra do processo:
        //   Aprovação Digital reprovada → volta pra Amostra Digital (refaz digital)
        //   Aprovação Física reprovada → volta pra Amostra Digital (refaz do início,
        //     o problema pode estar no design/programação, não só na física)
        const voltaMap={
          "Aprovação de Amostra Digital":"Amostra Digital",
          "Aprovação de Amostra Física":"Amostra Digital",
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
        await apiFetch(`/mover-posvenda/${o.posvendaId}`,"PATCH",{novaEtapa,nota:`${o.etapa} concluída`,ctx});
        resultMsg = `Pedido movido para ${nomeProx[o.etapa]}.`;
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

    // Sucesso — recarrega as filas E o snapshot geral. NÃO fecha o modal:
    // o botão exibe a tela de pós-execução com a mensagem. Mas quando o
    // usuário fechar, a Fila JÁ vai estar atualizada (sem o card processado).
    // O worker precisa de ~500ms pra HubSpot indexar a nova stage após o PATCH.
    setTimeout(()=>{ triggerRefresh(); _fetchSnap(true); }, 500);
    return resultMsg||"O pedido foi movimentado com sucesso.";
  };

  const TITLES={
    demandas:"Minhas Demandas",dashboard:"Dashboard",funil:"Funil em Tempo Real",
    painel_fluxo:"Painel de Fluxo",gestao_vista:"Gestão à Vista",pedidos_risco:"Pedidos em Risco",
    gerencial:"Gerencial",historico:"Histórico",ranking:"Ranking / Premiação",
    pedidos:"Pedidos em Aberto",direcionamento:"Direcionamento",
    programacao:"Programação",amostra_digital:"Amostra Digital",amostra_fisica:"Amostra Física",
    bordado_interno:"Bordado Interno",bordado_externo:"Bordado Externo",
    expedicao:"Expedição",faturamento:"Faturamento",finalizados:"Finalizados",alteracoes_form:"Alterações de Formulário",codigos_barra:"Códigos de Barra",impressao_pedido:"Impressão de Pedido",sla:"Configurações",usuarios:"Usuários",
  };
  const nav=id=>{setPage(id);setShowN(false);};

  if(!user)return <Login onLogin={doLogin}/>;

  return(
    <div style={{display:"flex",height:"100dvh",...F.body,background:C.gray100,overflow:"hidden",flexDirection:"column"}}>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {!isMobile&&<Sidebar user={user} active={page} onNav={nav} collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)}/>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <Topbar user={user} title={TITLES[page]||""} naoLidas={naoLidas} onBell={toggleBell} onLogout={doLogout} isMobile={isMobile}/>
          {showN&&<NotifPanel notifs={notifs} onClose={()=>setShowN(false)} onAbrir={abrirPedidoNotif}/>}
          <div className="sgp-scroll" style={{flex:1,overflowY:"auto",paddingBottom:isMobile?70:0}}>
            {page==="demandas"&&<MinhasDemandas user={user} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="dashboard"&&<Dashboard orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="funil"&&<Funil onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="painel_fluxo"&&<PainelFluxo/>}
            {page==="gestao_vista"&&<GestaoVista/>}
            {page==="pedidos_risco"&&<PedidosRisco/>}
            {page==="pedidos"&&<TodosPedidos onOpen={setSel} slaCfg={slaCfg} initialBusca={buscaPedidos}/>}
            {page==="em_separacao"&&<Fila title="Em Separação" etapa="Em Separação" endpoint="/em-separacao" orders={orders} onOpen={setSel} actionLabel="Ver pedido" actionColor={C.gray500} slaCfg={slaCfg}/>}
            {page==="conferencia_separacao"&&<ConferenciaSeparacao orders={orders} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="conferencia_direcionamento"&&<Direcionamento orders={orders} setOrders={setOrders} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="programacao"&&<Fila title="Programação de Bordado" etapa="Programação" endpoint="/programacao" orders={orders} onOpen={setSel} actionLabel="Marcar como programado" actionColor={C.amber} slaCfg={slaCfg}/>}
            {page==="amostra_digital"&&<Fila title="Amostra Digital" etapa="Amostra Digital" endpoint="/amostra-digital" orders={orders} onOpen={setSel} actionLabel="Enviar amostra" actionColor={C.purple} slaCfg={slaCfg} subTabsReprog/>}
            {page==="amostra_fisica"&&<Fila title="Amostra Física" etapa="Amostra Física" endpoint="/amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Notificar vendedor" actionColor="#be185d" slaCfg={slaCfg} subTabsReprog/>}
            {page==="aprovacao_amostra_digital"&&<Fila title="Aprovação de Amostra Digital" etapa="Aprovação de Amostra Digital" endpoint="/aprovacao-amostra-digital" orders={orders} onOpen={setSel} actionLabel="Aprovar/Reprovar" actionColor={C.blue} slaCfg={slaCfg}/>}
            {page==="aprovacao_amostra_fisica"&&<Fila title="Aprovação de Amostra Física" etapa="Aprovação de Amostra Física" endpoint="/aprovacao-amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Aprovar/Reprovar" actionColor={C.blue} slaCfg={slaCfg}/>}
            {page==="bordado_interno"&&<Fila title="Bordado Interno" etapa="Bordado Interno" endpoint="/bordado-interno" orders={orders} onOpen={setSel} actionLabel="Bordado concluído" actionColor={C.green} slaCfg={slaCfg}/>}
            {page==="bordado_externo"&&<BordadoExternoPage orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="expedicao"&&<Fila title="Expedição" etapa="Expedição" endpoint="/expedicao" orders={orders} onOpen={setSel} actionLabel="Enviar p/ análise de frete" actionColor={C.teal} slaCfg={slaCfg}/>}
            {page==="analise_frete"&&<Fila title="Análise de Frete" etapa="Análise de Frete" endpoint="/analise-frete" orders={orders} onOpen={setSel} actionLabel="Finalizar pedido" actionColor="#0891b2" slaCfg={slaCfg}/>}
            {page==="finalizados"&&<Fila title="Finalizados" etapa="Finalizado" endpoint="/finalizados" orders={orders} onOpen={setSel} slaCfg={slaCfg} finalizado/>}
            {page==="alteracoes_form"&&<AlteracoesFormList/>}
            {page==="codigos_barra"&&<CodigosBarra user={user}/>}
            {page==="impressao_pedido"&&<ImpressaoPedido user={user}/>}
            {page==="pendencia_comercial"&&<PendenciaComercial user={user}/>}
            {page==="aguardando_pedido"&&<AguardandoOutroPedido user={user}/>}
            {page==="rel_pendencias"&&<RelatorioPendencias user={user}/>}
            {page==="posvenda"&&<PainelPosVenda onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="banco_imagens"&&<BancoImagens user={user}/>}
            {page==="sla"&&<SLAConfig slaCfg={slaCfg} onSave={setSlaCfg}/>}
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
  const [vendedorDropdownAberto, setVendedorDropdownAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      // Passo 1: força carregar snapshot-aberto (popula o cache no worker)
      // Sem isso, o /painel-posvenda pode retornar 503 se ninguém abriu outras filas antes.
      await apiFetch("/snapshot-aberto").catch(()=>null);
      // Passo 2: painel usa o cache do snapshot
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
    if (filtroChip === "vencem_hoje" && !p.vencemHoje) return false;
    if (filtroEtapa && p.etapa !== filtroEtapa) return false;
    if (filtroVendedores.length > 0 && !filtroVendedores.includes(p.vendedor)) return false;
    if (busca) {
      const q = busca.toLowerCase();
      const bate = (p.client || "").toLowerCase().includes(q)
        || (p.pedidoLinx || "").toLowerCase().includes(q)
        || (p.cnpj || "").includes(q);
      if (!bate) return false;
    }
    return true;
  });

  // Cores das etapas
  const corEtapa = {
    "Em Separação": "#3b82f6", "Conferência Separação": "#0369a1",
    "Conferência e Direcionamento": "#059669", "Programação": "#f59e0b",
    "Amostra Digital": "#8b5cf6", "Aprovação de Amostra Digital": "#7c3aed",
    "Amostra Física": "#be185d", "Aprovação de Amostra Física": "#9d174d",
    "Bordado Interno": "#10b981", "Bordado Externo": "#6d28d9",
    "Bordado Interno e Externo": "#0d9488", "Expedição": "#14b8a6",
    "Análise de Frete": "#06b6d4",
  };

  // Dias parado na etapa
  const diasParado = (p) => {
    if (!p.etapaAt) return null;
    return Math.floor((Date.now() - new Date(p.etapaAt).getTime()) / (24*60*60*1000));
  };

  // Formata prazo
  const fmtPrazo = (venc) => {
    if (!venc) return "—";
    const dv = new Date(venc);
    const diff = dv.getTime() - Date.now();
    const dias = Math.floor(diff / (24*60*60*1000));
    if (dias < 0) return `Vencido ${Math.abs(dias)}d`;
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    if (dias < 7) return `${dias} dias`;
    return dv.toLocaleDateString("pt-BR", {day:"2-digit", month:"2-digit"});
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
            const dias = p.etapaAt ? Math.floor((Date.now() - new Date(p.etapaAt).getTime()) / (24*60*60*1000)) : "";
            const status = p.atrasado ? "Atrasado" : p.risco ? "Em risco" : "No prazo";
            const contato = p.aguardandoCliente ? "Aguardando cliente" : p.emPendencia ? "Pendência comercial" : "";
            return [p.pedidoLinx||"",p.vendasId||"",p.client||"",p.cnpj||"",p.vendedor||"",
              (p.valor||0).toFixed(2).replace(".",","),
              p.etapa||"", dias,
              p.etapaAt?new Date(p.etapaAt).toLocaleString("pt-BR"):"",
              p.dataVencimento?new Date(p.dataVencimento).toLocaleDateString("pt-BR"):"",
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
          <KpiCard label="Ativos" value={kpis.totalAtivos||0} sub={`R$ ${((kpis.valorTotalAtendimento||0)/1000).toFixed(1)}k`} color="#4b5563" active={filtroChip==="todos"} onClick={()=>setFiltroChip("todos")}/>
          <KpiCard label="Atrasados" value={kpis.atrasados||0} sub="Ação urgente" color={C.red} active={filtroChip==="atrasados"} onClick={()=>setFiltroChip("atrasados")}/>
          <KpiCard label="Em Risco" value={kpis.emRisco||0} sub="Vencem em ≤ 48h" color="#d97706" active={filtroChip==="risco"} onClick={()=>setFiltroChip("risco")}/>
          <KpiCard label="Vencem Hoje" value={kpis.vencemHoje||0} sub="Prazo do dia" color="#ea580c" active={filtroChip==="vencem_hoje"} onClick={()=>setFiltroChip("vencem_hoje")}/>
          <KpiCard label="Pendência Comercial" value={kpis.emPendencia||0} sub="Ação interna" color="#7c3aed" active={filtroChip==="pendencia"} onClick={()=>setFiltroChip("pendencia")}/>
          <KpiCard label="Aguardando Cliente" value={kpis.aguardandoCliente||0} sub="Aprovação amostra" color="#0891b2" active={filtroChip==="aguardando"} onClick={()=>setFiltroChip("aguardando")}/>
          <KpiCard label="Faturados Hoje" value={kpis.faturadosHoje||0} sub={`R$ ${((kpis.valorFaturadosHoje||0)/1000).toFixed(1)}k`} color={C.green}/>
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
      {kpis.vencemHoje > 0 && filtroChip !== "vencem_hoje" && <div style={{margin:"14px 32px",padding:"12px 16px",background:"#fef3c7",border:"1px solid #fcd34d",borderLeft:"4px solid #f59e0b",borderRadius:8,display:"flex",alignItems:"center",gap:12,...F.body,fontSize:13,color:"#92400e"}}>
        <span style={{fontSize:18}}>⚠️</span>
        <div style={{flex:1}}>
          <strong>{kpis.vencemHoje} pedido{kpis.vencemHoje!==1?"s":""}</strong> {kpis.vencemHoje!==1?"vencem":"vence"} hoje
        </div>
        <button onClick={()=>setFiltroChip("vencem_hoje")} style={{padding:"6px 12px",background:"#f59e0b",color:C.white,border:"none",borderRadius:5,fontSize:12,fontWeight:600,cursor:"pointer",...F.body}}>Ver</button>
      </div>}

      {/* Filtros */}
      <div style={{padding:"12px 32px",background:C.gray50,borderBottom:`1px solid ${C.gray200}`,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,maxWidth:340}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.gray400}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido, CNPJ..."
            style={{width:"100%",padding:"8px 12px 8px 34px",fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:6,outline:"none",background:C.white,...F.body,boxSizing:"border-box"}}/>
        </div>
        <select value={filtroEtapa} onChange={e=>setFiltroEtapa(e.target.value)} style={{padding:"8px 12px",fontSize:12,border:`1.5px solid ${C.gray200}`,background:C.white,borderRadius:6,color:C.gray700,cursor:"pointer",...F.body}}>
          <option value="">Todas as etapas</option>
          {Object.keys(dist).sort().map(e=><option key={e} value={e}>{e} ({dist[e]})</option>)}
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
              <InfoBox label="Vencimento" value={pedido.dataVencimento?new Date(pedido.dataVencimento).toLocaleDateString("pt-BR"):"—"} color={pedido.atrasado?C.red:pedido.risco?"#d97706":C.green}/>
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

export default function App(){
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

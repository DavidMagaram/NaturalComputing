Make sure to make the necessary changes in the js file manually as we are not passing parameters!

you will need both the necessary javascript and python modules installed. For javascript, follow the readme in the other folder. for python, it's just pandas and numpy

### Without obstacles:

```
rm img/*.png && node MyFirstSimulation.js > myfile.txt && ffmpeg -framerate 10 -start_number 0 -i "img/simulation-t%d.png" -vf "split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=full[p];[s1][p]paletteuse=dither=floyd_steinberg" output_no_obstacles.gif && python speedcheck.py > speedcheck_results_no_obstacles.txt
```
### With obstacles:
```
rm img/*.png && node MyFirstSimulation.js > myfile.txt && ffmpeg -framerate 10 -start_number 0 -i "img/simulation-t%d.png" -vf "split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=full[p];[s1][p]paletteuse=dither=floyd_steinberg" output_obstacles.gif && python speedcheck.py > speedcheck_results_obstacles.txt
```
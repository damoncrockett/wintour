import image_slicer
import sys

filestring = sys.argv[1]
num_slices = float(sys.argv[2])
target = sys.argv[3]
filetype = sys.argv[4]

tiles = image_slicer.slice(filestring,num_slices,save=False)
image_slicer.save_tiles(tiles,directory=target)
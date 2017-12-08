export default class LevelMap {
    constructor(game) {
        this.game = game;
        this.mapData = require('./lvl'+game.gameState.level+'.json');
        this.tiles = [];
        this.tilesets = [];
        this.layers = [];
        this.tileWidth = 0;
        this.tileHeight = 0;

        this.options = 0;
        // Release old tiles & tilesets
        this.tiles = [];
        this.tilesets = [];

        // Resize the map
        this.tileWidth = this.mapData.tilewidth;
        this.tileHeight = this.mapData.tileheight;
        this.mapWidth = this.mapData.width;
        this.mapHeight = this.mapData.height;
        this.mapWidthPixels = this.mapData.width * this.tileWidth;
        this.mapHeightPixels = this.mapData.height * this.tileHeight;
        this.game.screenPosition.y = this.mapHeightPixels - this.game.canvas.height;

        // Load the tileset(s)
        this.mapData.tilesets.forEach((tilesetmapData, index) => {
            // Load the tileset image
            let tileset = new Image();
            tileset.src = tilesetmapData.image;
            this.tilesets.push(tileset);

            // Create the tileset's tiles
            let colCount = tilesetmapData.columns,
                rowCount = tilesetmapData.tilecount / colCount,
                tileCount = tilesetmapData.tilecount;


            for (let i = 0; i < tileCount; i++) {
                let tile = {
                    // Reference to the image, shared amongst all tiles in the tileset
                    image: tileset,
                    // Source x position.  i % colCount == col number (as we remove full rows)
                    sx: (i % colCount) * this.tileWidth,
                    // Source y position. i / colWidth (integer division) == row number
                    sy: Math.floor(i / rowCount) * this.tileHeight,
                    // Indicates a solid tile (i.e. solid property is true).  As properties
                    // can be left blank, we need to make sure the property exists.
                    // We'll assume any tiles missing the solid property are *not* solid
                    //solid: !!(tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].solid === "true")
                    solid: (tilesetmapData.tiles[i] && tilesetmapData.tiles[i].objectgroup.properties.solid === true)
                };
                this.tiles.push(tile);
            }
        });

        // Parse the layers in the map
        this.mapData.layers.forEach((layerData) => {

            // Tile layers need to be stored in the engine for later
            // rendering
            if (layerData.type === "tilelayer") {
                // Create a layer object to represent this tile layer
                let layer = {
                    name: layerData.name,
                    width: layerData.width,
                    height: layerData.height,
                    visible: layerData.visible,
                    type: layerData.type
                };

                // Set up the layer's data array.  We'll try to optimize
                // by keeping the index data type as small as possible
                if (this.tiles.length < Math.pow(2, 8))
                    layer.data = new Uint8Array(layerData.data);
                else if (this.tiles.length < Math.pow(2, 16))
                    layer.data = new Uint16Array(layerData.data);
                else
                    layer.data = new Uint32Array(layerData.data);

                // save the tile layer
                this.layers.push(layer);
            }
            else if (layerData.type === "imagelayer") {
                let layer = {
                    name: layerData.name,
                    x: layerData.offsetx ? layerData.offsetx : 0,
                    y: layerData.offsety ? layerData.offsety : 0,
                    image: new Image(),
                    visible: layerData.visible,
                    type: layerData.type
                };
                layer.image.src = layerData.image;
                this.layers.push(layer);
            }
        });
        this.tileAt = this.tileAt.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        console.log(this);

    }

    tileAt(pos, layer) {
        // sanity check
        if (!layer) layer = 1;
        if (layer < 0 || pos.x < 0 || pos.y < 0 || layer >= this.layers.length || pos.x > this.mapWidth || pos.y > this.mapHeight)
            return undefined;
        return this.tiles[this.layers[layer].data[pos.x + pos.y * this.mapWidth] - 1];
    }

    render() {
        this.game.ctx.save();
        // Render tilemap layers - note this assumes
        // layers are sorted back-to-front so foreground
        // layers obscure background ones.
        // see http://en.wikipedia.org/wiki/Painter%27s_algorithm
        this.layers.forEach((layer) => {
            // Only draw layers that are currently visible
            if (layer.visible) {
                if (layer.type === "imagelayer") {
                     this.game.ctx.drawImage(layer.image, this.game.screenPosition.x,this.game.screenPosition.y,
                         this.game.canvas.width,this.game.canvas.height,layer.x+this.game.screenPosition.x, layer.y+this.game.screenPosition.y,this.game.canvas.width,this.game.canvas.height);
                    return;
                }

                let x0 = Math.max(0, Math.floor((this.game.screenPosition.x) / this.tileWidth - 2));
                let y0 = Math.max(0, Math.floor((this.game.screenPosition.y) / this.tileHeight - 2));
                let x1 = Math.min(layer.width, Math.floor((this.game.screenPosition.x + this.game.canvas.width) / this.tileWidth + 2));
                let y1 = Math.min(layer.height, Math.floor((this.game.screenPosition.y + this.game.canvas.height) / this.tileHeight + 2));
                for (let y = y0; y < y1; y++) {
                    for (let x = x0; x < x1; x++) {
                        let tileId = layer.data[x + layer.width * y];
                        // tiles with an id of 0 don't exist
                        if (tileId !== 0) {
                            let tile = this.tiles[tileId - 1];
                            if (tile.image) { // Make sure the image has loaded
                                this.game.ctx.drawImage(
                                    tile.image,     // The image to draw
                                    tile.sx, tile.sy, this.tileWidth, this.tileHeight, // The portion of image to draw
                                    x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight // Where to draw the image on-screen
                                );
                                //debug
                                // this.game.ctx.strokeStyle = "white";
                                // this.game.ctx.strokeRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
                                // this.game.ctx.fillStyle = "black";
                                // this.game.ctx.fillText(x + "," + y, x * this.tileWidth + 3, y * this.tileHeight + 30,);
                            }
                        }

                    }
                }
            }

        });
        this.game.ctx.restore();
    }

    update() {

    }


}

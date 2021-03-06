/*КЛАСТЕРИЗАЦИЯ ДИАГРАММАМИ*/
!function (t) {
    var e = {modules: t.ymaps.modules};
    !function (t) {
        if ("undefined" == typeof t && "function" == typeof require) var t = require("ym");
        t.define("util.providePackage", ["system.mergeImports"], function (t, e) {
            t(function (t, n) {
                var o = n[0], r = Array.prototype.slice.call(n, 1), a = e.joinImports(t.name, {}, t.deps, r);
                o(a)
            })
        })
    }(e.modules), e.modules.define("PieChartClusterer", ["Clusterer", "util.defineClass", "util.extend", "PieChartClusterer.icon.params", "PieChartClusterer.component.Canvas"], function (t, e, n, o, r, a) {
        var i = n(function (t) {
            i.superclass.constructor.call(this, t), this._canvas = new a(r.icons.large.size), this._canvas.options.setParent(this.options)
        }, e, {
            createCluster: function (t, e) {
                var n = i.superclass.createCluster.call(this, t, e), a = e.reduce(function (t, e) {
                    var n = e.options.get("iconColor", "lightBlue");
                    return t[n] = ++t[n] || 1, t
                }, {}), s = this._canvas.generateIconDataURL(a, e.length), c = {
                    clusterIcons: [o({href: s}, r.icons.small), o({href: s}, r.icons.medium), o({href: s}, r.icons.large)],
                    clusterNumbers: r.numbers
                };
                return n.options.set(c), n
            }
        });
        t(i)
    }), e.modules.define("RandomPointsGenerator", ["coordSystem.geo"], function (t, e) {
        function n(t) {
            this.count = t || 0
        }

        n.generate = function (t) {
            return new n(t)
        }, n.prototype.generate = function (t) {
            return this.count = t, this
        }, n.prototype.atBounds = function (t) {
            for (var e = [t[1][0] - t[0][0], t[1][1] - t[0][1]], n = [], o = 0; o < this.count; o++) n[o] = this.createPlacemark([Math.random() * e[0] + t[0][0], Math.random() * e[1] + t[0][1]], o);
            return n
        }, n.prototype.atCenterAndRadius = function (t, n) {
            for (var o = [], r = 0; r < this.count; r++) {
                var a = [Math.random() - Math.random(), Math.random() - Math.random()], i = n * Math.random(),
                    s = e.solveDirectProblem(t, a, i).endPoint;
                o[r] = this.createPlacemark(s, r)
            }
            return o
        }, n.prototype.atCenterAndSize = function (t, e) {
        }, n.prototype.createPlacemark = function (t, e) {
            return new ymaps.GeoObject({
                geometry: {type: "Point", coordinates: t},
                properties: this.getPointData(e)
            }, this.getPointOptions(e))
        }, n.prototype.getPointData = function (t) {
            return {}
        }, n.prototype.getPointOptions = function (t) {
            return {}
        }, t(n)
    }), e.modules.define("PieChartClusterer.component.Canvas", ["option.Manager", "PieChartClusterer.icon.colors"], function (t, e, n) {
        var o = {
            canvasIconStrokeStyle: "white",
            canvasIconLineWidth: 2,
            canvasIconCoreRadius: 23,
            canvasIconCoreFillStyle: "white"
        }, r = function (t) {
            this._canvas = document.createElement("canvas"), this._canvas.width = t[0], this._canvas.height = t[1], this._context = this._canvas.getContext("2d"), this.options = new e({})
        };
        r.prototype.generateIconDataURL = function (t, e) {
            return this._drawIcon(t, e), this._canvas.toDataURL()
        }, r.prototype._drawIcon = function (t, e) {
            var n = 0, r = 360, a = this._context, i = this._canvas.width / 2, s = this._canvas.height / 2,
                c = this.options.get("canvasIconLineWidth", o.canvasIconLineWidth),
                l = this.options.get("canvasIconStrokeStyle", o.canvasIconStrokeStyle), u = Math.floor((i + s - c) / 2);
            a.strokeStyle = l, a.lineWidth = c, Object.keys(t).forEach(function (o) {
                var c = t[o];
                r = n + 360 * c / e, a.fillStyle = o || this._getStyleColor(o), e > c ? n = this._drawSector(i, s, u, n, r) : this._drawCircle(i, s, u)
            }, this), this._drawCore(i, s)
        }, r.prototype._drawCore = function (t, e) {
            var n = this._context, r = this.options.get("canvasIconCoreFillStyle", o.canvasIconCoreFillStyle),
                a = this.options.get("canvasIconCoreRadius", o.canvasIconCoreRadius);
            n.fillStyle = r, this._drawCircle(t, e, a)
        }, r.prototype._drawCircle = function (t, e, n) {
            var o = this._context;
            o.beginPath(), o.arc(t, e, n, 0, 2 * Math.PI), o.fill(), o.stroke()
        }, r.prototype._drawSector = function (t, e, n, o, r) {
            var a = this._context;
            return a.beginPath(), a.moveTo(t, e), a.arc(t, e, n, this._toRadians(o), this._toRadians(r)), a.lineTo(t, e), a.closePath(), a.fill(), a.stroke(), r
        }, r.prototype._toRadians = function (t) {
            return t * Math.PI / 180
        }, r.prototype._getStyleColor = function (t) {
            return n.hasOwnProperty(t) ? n[t] : t
        }, t(r)
    }), e.modules.define("PieChartClusterer.icon.colors", [], function (t) {
        var e = {
            blue: "#1E98FF",
            red: "#ED4543",
            darkOrange: "#E6761B",
            night: "#0E4779",
            darkBlue: "#177BC9",
            pink: "#F371D1",
            gray: "#B3B3B3",
            brown: "#793D0E",
            darkGreen: "#1BAD03",
            violet: "#B51EFF",
            black: "#595959",
            yellow: "#FFD21E",
            green: "#56DB40",
            orange: "#FF931E",
            lightBlue: "#82CDFF",
            olive: "#97A100"
        };
        t(e)
    }), e.modules.define("PieChartClusterer.icon.params", ["shape.Circle", "geometry.pixel.Circle"], function (t, e, n) {
        t({
            icons: {
                small: {size: [46, 46], offset: [-23, -23], shape: new e(new n([0, 2], 21.5))},
                medium: {size: [58, 58], offset: [-29, -29], shape: new e(new n([0, 2], 27.5))},
                large: {size: [71, 71], offset: [-35.5, -35.5], shape: new e(new n([0, 2], 34))}
            }, numbers: [10, 100]
        })
    })
}(this);
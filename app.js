//       var viewer = new Cesium.Viewer('cesiumContainer');        // Load Cesium World Terrain
//       viewer.terrainProvider = Cesium.createWorldTerrain({
//       requestWaterMask : true, // required for water effects
//       requestVertexNormals : true // required for terrain lighting
// });
//       viewer.scene.globe.depthTestAgainstTerrain = true;
// let viewer = new Cesium.Viewer("cesiumContainer",{
//     terrainProvider: Cesium.createWorldTerrain()//快速创建世界地形
// });

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjg1NzU4Ni00NTA5LTRhOWQtYjBhOC02ZGVjMjI1YjY1NmUiLCJpZCI6MTAwMDgwLCJpYXQiOjE2NTY5ODk1ODV9.aAT7f3t2WTUmL21pJ149oQPcVekgfhvGeVeU-G0ctRQ'
var viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1)
  }),
  sceneMode: Cesium.SceneMode.SCENE3D
})
viewer.imageryLayers.addImageryProvider(
  new Cesium.IonImageryProvider({ assetId: 3 })
)

viewer.camera.setView({
    // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    // fromDegrees()方法，将经纬度和高程转换为世界坐标
    destination: Cesium.Cartesian3.fromDegrees(114.028241, 22.613292 , 130),
    orientation: {
        // 指向
        heading: 5.881247363707091,
        // 视角
        pitch: -0.33444919517164173,
        roll: 0.000008185191711973516
    }
});

var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
//Cesium.ScreenSpaceEventType.MOUSE_MOVE ：监听鼠标移动
handler.setInputAction(function(event) {

}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

show3DCoordinates()
function show3DCoordinates() {


    var coordinatesDiv = document.getElementById("map_coordinates");
    if (coordinatesDiv) {
        coordinatesDiv.style.display = "block";
    } else {
        coordinatesDiv = document.createElement("div");
        coordinatesDiv.id = "map_coordinates";
        coordinatesDiv.style.zIndex = "50";
        coordinatesDiv.style.bottom = "1px";
        coordinatesDiv.style.height = "29px";
        coordinatesDiv.style.position = "absolute";
        coordinatesDiv.style.overflow = "hidden";
        coordinatesDiv.style.textAlign = "center";
        coordinatesDiv.style.padding = '0 10px';
        coordinatesDiv.style.background = "rgba(0,0,0,0.5)";
        coordinatesDiv.style.left = "0";
        coordinatesDiv.style.bottom = "0";
        coordinatesDiv.style.lineHeight = "29px";
        coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
        document.getElementById("cesiumContainer").append(coordinatesDiv);
        var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler3D.setInputAction((movement) => {
            var pick = new Cesium.Cartesian2(movement.endPosition.x, movement.endPosition.y);
            if (pick) {
                var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
                if (cartesian) {
                    //世界坐标转地理坐标（弧度）
                    var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                    if (cartographic) {
                        //海拔
                        var height = viewer.scene.globe.getHeight(cartographic);
                        //视角海拔高度
                        var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
                        var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
                        //地理坐标（弧度）转经纬度坐标
                        var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                        if (!height) {
                            height = 0;
                        }
                        if (!he) {
                            he = 0;
                        }
                        if (!he2) {
                            he2 = 0;
                        }
                        if (!point) {
                            point = [0, 0];
                        }
                        coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>视角高度:" + (he - he2).toFixed(2) + "米&nbsp;&nbsp;&nbsp;&nbsp;海拔高度:" + height.toFixed(2) + "米&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6) + "</span>";
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}


var b = [{
    "shootId": 1, // 拍摄点ID
    "aircraftAltitude": 75, // 无人机高度
    "aircraftLatitude": 22.613292, // 无人机纬度
    "aircraftLongitude": 114.028240, // 无人机经度
    "gimbalPitchValue": -34.86589098646805, // 无人机云台俯仰角
    "gimbalYawValue": -141.52559172027878, // 无人机云台偏航角
    "isShoot": false // 是否为拍摄点
},
{
    "shootId": 2,
    "aircraftAltitude": 75,
    "aircraftLatitude": 22.613292,
    "aircraftLongitude": 114.028245,
    "gimbalPitchValue": -29.77056379217234,
    "gimbalYawValue": -141.52559171972544,
    "isShoot": true
},
{
    "shootId": 3,
    "aircraftAltitude": 75,
    "aircraftLatitude": 22.613292,
    "aircraftLongitude": 114.028250,
    "gimbalPitchValue": -49.79999923706055,
    "gimbalYawValue": -143.6999969482422,
    "isShoot": true
},
{
    "shootId": 4,
    "aircraftAltitude": 75,
    "aircraftLatitude": 22.613292,
    "aircraftLongitude": 114.028255,
    "gimbalPitchValue": 0,
    "gimbalYawValue": -96.52559172238325,
    "isShoot": true
},

]

/**
* @param {*} viewer 
* @param {*} options.speed 速度m/s 
* @param {*} options.stayTime 拍摄点等待时间  
* @param {*} options.Lines  点集合 
* @param {*} options.frustumFar  视锥长度 
* @param {*} options.shootCallback  拍摄点回调函数返回isShoot为true的shootId
* @memberof Track
*/
let roaming = new Track(viewer, {
    Lines: b,
    stayTime: 1,
    speed: 3,
    frustumFar: 10,
    shootCallback: function (shootId) {
        console.log(shootId)
    }
})

setTimeout(function () {

    /**
     *航迹模拟开始飞行
     * @memberof roaming.StartFlying()
     */

    roaming.StartFlying()

    /**
     *航迹模拟的暂停和继续
     *
     * @param {*} state bool类型 false为暂停，ture为继续
     * @memberof roaming.PauseOrContinue(state)
     */

    //roaming.PauseOrContinue(true)//false为暂停，ture为继续

    /**
     *改变飞行的速度
     *
     * @param {*} value  整数类型 建议（1-20）
     * @memberof roaming.ChangeRoamingSpeed(value)
     */

    //roaming.ChangeRoamingSpeed(1)


    /**
     * 改变观看角度
     *
     * @param {*} name string 
     * 
     * ViewTopDown:顶视图
     * ViewSide ：正视图
     * trackedEntity：跟随模型
     * 
     * @memberof ChangePerspective(name)
     */

    roaming.ChangePerspective("trackedEntity")

    /**
     *取消航迹模拟
     *
     * @memberof roaming.EndRoaming()
     */

    //roaming.EndRoaming()


}, 7000)

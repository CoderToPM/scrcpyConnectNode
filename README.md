# scrcpyConnectNode
scrcpy将Android图像通过视频流的方式给web展现，用于云控云测操作
目前实现了利用socket通信，将node服务与scrcpy对接，然后再通过websocket通信传送到web页面，实时渲染手机屏幕

以下是相关命令来开启设备的相关通信端口
>adb push /Users/heyongchao/StudioProjects/scrcpy/x/server/scrcpy-server.jar /data/local/tmp/

>adb shell CLASSPATH=/data/local/tmp/scrcpy-server.jar  app_process / com.genymobile.scrcpy.Server 0 8000000 true 1080:1920:0:0 true true

>//adb forward tcp:3002 localabstract:scrcpy

>adb reverse tcp:3001 localabstract:scrcpy
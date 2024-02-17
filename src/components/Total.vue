<script lang="ts" setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

import { loading, unloading } from '@/services/ui'

onMounted(() => {
  chart1()
  chart2()

  // loading()

  // setTimeout(() => {
  //   unloading()
  // }, 2000)
})

function chart1() {
  const myChart = echarts.init(document.getElementById('chart-panel'))

  const option = {
    backgroundColor: '#fff',
    title: {
      text: '实时使用量',
      textStyle: {
        fontSize: 12,
        fontWeight: 400
      },
      left: 'center',
      top: '5%'
    },
    legend: {
      icon: 'circle',
      top: '5%',
      right: '5%',
      itemWidth: 6,
      itemGap: 20,
      textStyle: {
        color: '#556677'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true,
          backgroundColor: '#fff',
          color: '#556677',
          borderColor: 'rgba(0,0,0,0)',
          shadowColor: 'rgba(0,0,0,0)',
          shadowOffsetY: 0
        },
        lineStyle: {
          width: 0
        }
      },
      backgroundColor: '#fff',
      textStyle: {
        color: '#5c6c7c'
      },
      padding: [10, 10],
      extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
    },
    grid: {
      top: '15%'
    },
    xAxis: [{
      type: 'category',
      data: ['景点1', '景点2', '景点3', '景点4', '景点5', '景点6', '景点7'],
      axisLine: {
        lineStyle: {
          color: '#DCE2E8'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        // textStyle: {
        //   color: '#556677'
        // },
        // 默认x轴字体大小
        fontSize: 12,
        // margin:文字到x轴的距离
        margin: 15
      },
      axisPointer: {
        label: {
          padding: [0, 0, 10, 0],
          margin: 15,
          // 移入时的字体大小
          fontSize: 12,
          backgroundColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#fff' // 0% 处的颜色
            }, {
              offset: 0.86,
              color: '#fff' // 0% 处的颜色
            }, {
              offset: 0.86,
              color: '#33c0cd' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#33c0cd' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      },
      boundaryGap: false
    }],
    yAxis: [{
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#DCE2E8'
        }
      },
      axisLabel: {

      },
      splitLine: {
        show: false
      }
    }, {
      type: 'value',
      position: 'right',
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: '{value}'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#DCE2E8'
        }
      },
      splitLine: {
        show: false
      }
    }],
    series: [{
      name: '同比',
      type: 'line',
      data: [10, 10, 30, 12, 15, 3, 7],
      symbolSize: 1,
      symbol: 'circle',
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: '#9effff'
        },
        {
          offset: 1,
          color: '#9E87FF'
        }
        ]),
        shadowColor: 'rgba(158,135,255, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      }
    }, {
      name: '环比',
      type: 'line',
      data: [5, 12, 11, 14, 25, 16, 10],
      symbolSize: 1,
      symbol: 'circle',
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
          offset: 0,
          color: '#73DD39'
        },
        {
          offset: 1,
          color: '#73DDFF'
        }
        ]),
        shadowColor: 'rgba(115,221,255, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      },
    },
    {
      name: '当日',
      type: 'line',
      data: [150, 120, 170, 140, 500, 160, 110],
      symbolSize: 1,
      yAxisIndex: 1,
      symbol: 'circle',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: '#fe9a'
        },
        {
          offset: 1,
          color: '#fe9a8b'
        }
        ]),
        shadowColor: 'rgba(254,154,139, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      }
    }
    ]
  }

  if (option) {
    myChart.setOption(option)
  }
}

function chart2() {
  var chartDom = document.getElementById('chart-line')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }
    ]
  }

  option && myChart.setOption(option)
}

</script>

<template>
  <div class="w-full h-full">
    <div id="chart-panel"></div>
    <div id="chart-line"></div>
  </div>
</template>

<style>
#chart-panel,
#chart-line {
  width: 100%;
  height: 50%;
}
</style>
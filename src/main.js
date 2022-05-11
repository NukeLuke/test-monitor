import React from 'react'
import ReactDom from 'react-dom'
import moment from 'dayjs'
import 'dayjs/locale/zh-cn'

import './styles/resetAntd.less'
import './styles/main.less'
import App from '@/App'
import App1 from '@/App1'

moment.locale('zh-cn')

const Page = () => (
    <App1 />
)

ReactDom.render(<Page />, document.getElementById('app'))

// 热更新
if (module.hot) {
    module.hot.accept(err => {
        if (err) {
            console.error('module.hot，', err)
        }
    })
}

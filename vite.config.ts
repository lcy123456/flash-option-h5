import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import sassPlugin from "vite-plugin-sass";
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { terser } from 'rollup-plugin-terser'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		nodePolyfills(),
		vue({
			script: {
				defineModel: true
			}
		}),
		WindiCSS(),
		createSvgIconsPlugin({
			// 指定需要缓存的图标文件夹
			iconDirs: [path.resolve(process.cwd(), 'src/assets/icon')],
			// 指定symbolId格式
			symbolId: 'icon-[name]'
		}),
		codeInspectorPlugin({
			bundler: 'vite'
		}),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@pub': path.resolve(__dirname, 'public')
		}
	},
	build: {
		rollupOptions: {
			external: ['jquery'], // 指定要作为外部依赖的库
			output: {
				globals: {
					jquery: '$' // 指定全局变量的名字，这里 jQuery 的全局变量通常为 $ 或 jQuery
				}
			},
			plugins: [
				terser({
					format: {
						comments: false
					},
					mangle: true,
					compress: {
						// drop_console: true, // 移除 console 语句
						// pure_funcs: ['console.log'] // 移除 console.log
					}
				})
			]
		}
	},
	server: {
		host: '0.0.0.0', // 使服务器对外部请求可见
		port: 3000, // 更改服务器端口
		open: true, // 启动时自动打开浏览器
		cors: true, // 启用跨域资源共享
		proxy: {
			// 配置代理
			'/api': {
				target: 'https://api.apex1111.com', // 代理目标
				changeOrigin: true, // 改变原始主机头为目标机器
				rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
			}
		}
	}
})

const ForkTsCheckerWebpackPlugin=require("fork-ts-checker-webpack-plugin");
// const CopyPlugin=require("copy-webpack-plugin");
// const WebpackBar=require("webpackbar");

module.exports={
    mode:"development",
    entry:{
        flexpedition:"./flexpedition.ts"
    },
    output:{
        path:`${__dirname}/build`,
        filename:"[name].js"
    },

    module:{
        rules:[
            {
                test:/\.(tsx|ts)$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:["@babel/preset-typescript"]
                    }
                }
            }
        ]
    },

    plugins:[
        new ForkTsCheckerWebpackPlugin(),

        // new CopyPlugin([
        //     {from:"src/index.html",to:"../"}
        // ]),

        // new WebpackBar()
    ],

    optimization:{
        splitChunks:{
            chunks:"all",
            automaticNameDelimiter:"-"
        }
    },

    resolve:{
        extensions:[".tsx",".ts",".jsx",".js"]
    }
};
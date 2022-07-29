const { Extension, type, api } = require('clipcc-extension');

let alerted = false;
class Chlorophyll extends Extension {
    onInit() {
        api.addCategory({
            categoryId: 'shiki.chlorophyll.category',
            messageId: 'shiki.chlorophyll.category',
            color: '#25bb62'
        });
        api.addBlock({
            opcode: 'shiki.chlorophyll.upload',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.chlorophyll.upload',
            categoryId: 'shiki.chlorophyll.category',
            param: {
                AS: {
                    type: type.ParameterType.STRING,
                    menu: [{
                        messageId: 'shiki.chlorophyll.as.text',
                        value: 'text'
                    }, {
                        messageId: 'shiki.chlorophyll.as.binary',
                        value: 'binary'
                    }, {
                        messageId: 'shiki.chlorophyll.as.dataUrl',
                        value: 'dataUrl'
                    }],
                    default: 'text'
                }
            },
            function: (args) => {
                return new Promise(resolve => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.onchange = () => {
                        const reader = new FileReader();
                        const file = input.files[0];
                        reader.onload = (e) => {
                            resolve(e.target.result);
                        };
                        reader.onerror = (e) => {
                            console.error(e);
                            resolve();
                        };
                        switch (args.AS) {
                        case 'text': {
                            reader.readAsText(file);
                            break;
                        }
                        case 'binary': {
                            reader.readAsBinaryString(file);
                            break;
                        }
                        case 'dataUrl': {
                            reader.readAsDataURL(file);
                            break;
                        }
                        default: {
                            resolve();
                        }
                        }
                    }
                    input.click();
                });
            }
        });
        api.addBlock({
            opcode: 'shiki.chlorophyll.url',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.chlorophyll.url',
            categoryId: 'shiki.chlorophyll.category',
            param: {
                TYPE: {
                    type: type.ParameterType.STRING,
                    menu: [{
                        messageId: 'shiki.chlorophyll.type.domain',
                        value: 'domain'
                    }, {
                        messageId: 'shiki.chlorophyll.type.url',
                        value: 'url'
                    }, {
                        messageId: 'shiki.chlorophyll.type.protocol',
                        value: 'protocol'
                    }, {
                        messageId: 'shiki.chlorophyll.type.port',
                        value: 'port'
                    }, {
                        messageId: 'shiki.chlorophyll.type.pathname',
                        value: 'pathname'
                    }, {
                        messageId: 'shiki.chlorophyll.type.hash',
                        value: 'hash'
                    }, {
                        messageId: 'shiki.chlorophyll.type.queries',
                        value: 'queries'
                    }],
                    default: 'domain'
                }
            },
            function: (args) => {
                switch (args.TYPE) {
                case 'domain': return window.location.host || '';
                case 'url': return window.location.href || '';
                case 'protocol': return window.location.protocol || '';
                case 'port': return window.location.port || '';
                case 'pathname': return window.location.pathname || '';
                case 'hash': return window.location.hash || '';
                case 'search': return window.location.search || '';
                default: return;
                }
            }
        });
        api.addBlock({
            opcode: 'shiki.chlorophyll.query',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.chlorophyll.query',
            categoryId: 'shiki.chlorophyll.category',
            param: {
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'name'
                }
            },
            function: (args) => {
                const reg = new RegExp('(^|&)' + args.NAME + '=([^&]*)(&|$)', 'i');
                const result = window.location.search.substr(1).match(reg);
                if (result !== null) return unescape(result[2]) || '';
                return '';
            }
        });
        api.addBlock({
            opcode: 'shiki.chlorophyll.open',
            type: type.BlockType.COMMAND,
            messageId: 'shiki.chlorophyll.open',
            categoryId: 'shiki.chlorophyll.category',
            param: {
                PATH: {
                    type: type.ParameterType.STRING,
                    default: 'user/1'
                },
                METHOD: {
                    type: type.ParameterType.STRING,
                    menu: [{
                        messageId: 'shiki.chlorophyll.method.blank',
                        value: '_blank'
                    }, {
                        messageId: 'shiki.chlorophyll.method.self',
                        value: '_self'
                    }],
                    default: '_blank'
                }
            },
            function: (args) => {
                // 别针社区特供
                if (window.clipAlert) {
                    if (alerted) return;
                    return new Promise(resolve => {
                        alerted = true;
                        clipAlert('跳转警告', `该作品尝试将您跳转至 https://codingclip.com/${args.PATH}, 您确定要进行跳转吗？`)
                            .then(result => {
                                if (result) window.open(`https://codingclip.com/${args.PATH}`, args.METHOD);
                                alerted = false;
                                resolve();
                            });
                    });
                }
                if (window.confirm(`该作品尝试将您跳转至 https://codingclip.com/${args.PATH}, 您确定要进行跳转吗？`)) {
                    window.open(`https://codingclip.com/${args.PATH}`, args.METHOD);
                }
            }
        });
        api.addBlock({
            opcode: 'shiki.chlorophyll.write',
            type: type.BlockType.COMMAND,
            messageId: 'shiki.chlorophyll.write',
            categoryId: 'shiki.chlorophyll.category',
            param: {
                KEY: {
                    type: type.ParameterType.STRING,
                    default: 'key'
                },
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'value'
                }
            },
            function: (args) => {
                if (localStorage) {
                    localStorage.setItem(args.KEY, args.VALUE);
                }
            }
        });
        api.addBlock({
            opcode: 'shiki.chlorophyll.read',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.chlorophyll.read',
            categoryId: 'shiki.chlorophyll.category',
            param: {
                KEY: {
                    type: type.ParameterType.STRING,
                    default: 'key'
                }
            },
            function: (args) => localStorage ? localStorage.getItem(args.KEY) : ''
        });
    }
    
    onUninit () {
        api.removeCategory('shiki.chlorophyll.category');
    }
}

module.exports = Chlorophyll;

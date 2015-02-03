var React = require('react/addons'),
    ColorPicker = require('react-color-picker'),
    tinycolor = require('tinycolor2'),
    download = require('../services/download'),
    http = require('superagent');

module.exports = UploadForm = React.createClass({
    getInitialState: function() {
        return {
            data_uri: null,
            name: null,
            filename: null,
            color: '#337AB7',
            text_color: '#000',
            preview: null,
            valid: false,
            drag_timeout: null
        };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var self = this;

        if(!self.state.valid) {
            console.log('Cannot upload without a file, name, and color!');
            return;
        }

        self.props.onSubmit();

        http
            .post('/icons')
            .send({ data_uri: self.state.data_uri, name: self.state.name, color: self.state.color })
            .end(function(err, res) {
                if(err) {
                    self.props.onError();
                } else {
                    self.setState({
                        preview: res.text
                    });
                    self.props.onIcon();
                }
            });
    },
    handleFile: function(e) {
        var self = this,
            reader = new FileReader(),
            file = e.target.files[0];

        reader.onload = function(upload) {
            self.setState({
                data_uri: upload.target.result
            });
            self.validate();
            console.log('valid?', self.state.valid);
        };

        reader.readAsDataURL(file);
    },
    validate: function() {
        if(this.state.name && this.state.color && this.state.data_uri) {
            this.setState({ valid: true })
        } else {
            this.setState({ valid: false })
        }
    },
    handleName: function(event) {
        this.setState({ name: event.target.value });
        this.validate();
    },
    handleColor: function(event) {
        this.setState({ color: event.target.value });
        this.validate();
    },
    handleDrag: function(color) {
        var self = this;

        clearTimeout(self.state.drag_timeout);
        var timeout = setTimeout(function() {
            var l = tinycolor(color).toHsl().l,
                tc = self.state.text_color;

            if(l < .35 && tc != '#ccc') {
                self.setState({ text_color: '#ccc' });
            } else if(tc != '#000') {
                self.setState({ text_color: '#000' });
            }

            self.validate();
        }, 100);

        self.setState({ color: color, drag_timeout: timeout });
    },
    download: function() {
        if(!this.state.preview) {
            console.log('preview is empty');
            return;
        }

        download({
            content: this.state.preview,
            name: this.state.name+'.png',
            type: 'image/png'
        });
    },
    render: function() {
        var cx = React.addons.classSet,
            formClasses = cx({
                valid: this.state.valid
            });

        return (
            <form onSubmit={this.handleSubmit} className={formClasses}>
                <div className='inputs'>
                    <div className='field'>
                        <label>Name</label>
                        <input type="text" id="name" name="name" onChange={this.handleName} value={this.state.name}/>
                    </div>
                    <div className='field'>
                        <label>Color</label>
                        <input type="text" id="color" name="color" onChange={this.handleColor} value={this.state.color} style={{ background: this.state.color, color: this.state.text_color }}/>
                        <ColorPicker value={this.state.color} onDrag={this.handleDrag} saturationWidth={100} saturationHeight={100} hueWidth={20} />
                    </div>
                    <div className='field'>
                        <label>Icon</label>
                        <input type="file" id="icon" name="icon" onChange={this.handleFile}/>
                    </div>
                    <button className='btn fill' id="upload" type="submit" disabled={!this.state.valid}>Create Hex Icon</button>
                </div>

                <div className='result'>
                    <div className='preview'>
                        <img src={this.state.preview} />
                    </div>
                    <div className='info'>
                        <div className='filename'>{this.state.filename}</div>
                        <div className="btn download primary" onClick={this.download} download>Download</div>
                    </div>
                </div>
            </form>
        );
    }
});
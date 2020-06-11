import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import compose from 'recompose/compose';

const useStyles = (theme) => ({
    formControl: {
        margin: 0,
        minWidth: 150,
        maxWidth: 150,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    '@global': {
        '*, *::before, *::after': {
            transition: 'none !important',
            animation: 'none !important',
        },
    },
});

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
            width: 'auto',
        },
    },
};

export class MultipleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { tipOpen: false };
    }

    componentDidMount() {

    }

    componentDidUpdate() {
    }

    handleChange = (e) => {
        const { onChange } = this.props;
        console.log('handleChange', e.target.value);
        onChange(e);
    }

    handleEnter = () => {
        this.setState({
            tipOpen: true,
        });
    }

    handleLeave = () => {
        this.setState({
            tipOpen: false,
        });
    }

    handleOpen = () => {
        this.setState({
            tipOpen: false,
        });
    }

    render() {
        // const { selectedValue, tipOpen } = this.state;
        const { tipOpen } = this.state;
        const {
            classes, multiple, blank, items, value,
        } = this.props;
        const titleStr = (typeof value === 'string') ? value : value.join(', ');

        let content = [];

        if (multiple) {
            content = items.map((item) => (
                <MenuItem style={{ padding: '0px 10px' }} key={item} value={item}>
                    <Checkbox size="small" style={{ padding: '0px 10px 0px 0px' }} checked={value.indexOf(item) > -1} />
                    <ListItemText primary={item} />
                </MenuItem>
            ));
        } else if (blank) {
            content = [(
                <MenuItem style={{ padding: '0px 10px' }} key="" value="">
                    <ListItemText primary="None" />
                </MenuItem>
            ), ...(items.map((item) => (
                <MenuItem style={{ padding: '0px 10px' }} key={item} value={item}>
                    <ListItemText primary={item} />
                </MenuItem>
            )))];
        } else {
            content = items.map((item) => (
                <MenuItem style={{ padding: '0px 10px' }} key={item} value={item}>
                    <ListItemText primary={item} />
                </MenuItem>
            ));
        }
        return (
            <div>
                <Tooltip title={titleStr} arrow open={tipOpen}>
                    {/* classes.formControl */}
                    <FormControl className="sss">

                        {/* <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel> */}
                        <Select
                            // labelId="demo-mutiple-checkbox-label"
                            // id="demo-mutiple-checkbox"
                            multiple={multiple}
                            value={value}
                            onChange={this.handleChange}
                            onMouseEnter={this.handleEnter}
                            onMouseLeave={this.handleLeave}
                            onOpen={this.handleOpen}
                            // input={<Input />}
                            style={{ fontSize: '10px' }}
                            renderValue={(selected) => ((typeof selected === 'string') ? selected : selected.join('; '))}
                            MenuProps={MenuProps}
                        >
                            {content}
                        </Select>
                    </FormControl>
                </Tooltip>
            </div>
        );
    }
}

MultipleSelect.defaultProps = {
    multiple: false,
    blank: false,
    items: [],
    value: [],
    onChange: () => { },
};

MultipleSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    multiple: PropTypes.bool,
    blank: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.any),
    value: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
};

// export default compose(
//     withStyles(useStyles, { name: 'MultipleSelect' }),
//     connect(null, {}),
// )(MultipleSelect);


export default connect(null, {})(MultipleSelect);

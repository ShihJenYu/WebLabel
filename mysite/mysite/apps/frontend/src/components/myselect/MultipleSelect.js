import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import compose from 'recompose/compose';
import store from '../../store';

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

// TODO use prop passing
const items = [
    'Oliver Hansen',
    'Van HenryHenryHenry AAAA',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'somosmaodmoasmdoasdakdasdasdadada',
    'weewweweewewewewewewewe',
    'aa',
];

// const classes = useStyles();

export class MultipleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedValue: [], tipOpen: false };
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        console.log('componentDidUpdate in MultipleSelect');
        console.log(this.state);
    }

    handleChange = (e) => {
        console.log('handleChange', e.target.value);
        this.setState({
            selectedValue: e.target.value,
        });
    }

    handleEnter = (e) => {
        console.log('handleOpen', e.target.value);
        this.setState({
            tipOpen: true,
        });
    }

    handleLeave = (e) => {
        console.log('handleOpen', e.target.value);
        this.setState({
            tipOpen: false,
        });
    }

    handleOpen = (e) => {
        console.log('handleOpen', e.target.value);
        this.setState({
            tipOpen: false,
        });
    }

    render() {
        const { selectedValue, tipOpen } = this.state;
        const { classes, multiple } = this.props;
        console.log('selectedValue', selectedValue);
        const titleStr = (typeof selectedValue === 'string') ? selectedValue : selectedValue.join(', ');

        console.log('content,', 'content');
        let content = [];

        console.log('content,', content);
        if (multiple) {
            content = items.map((item) => (
                <MenuItem style={{ padding: '0px 10px' }} key={item} value={item}>
                    <Checkbox size="small" style={{ padding: '0px 10px 0px 0px' }} checked={selectedValue.indexOf(item) > -1} />
                    <ListItemText primary={item} />
                </MenuItem>
            ));
        } else {
            content = [(
                <MenuItem style={{ padding: '0px 10px' }} key="" value="">
                    <ListItemText primary="None" />
                </MenuItem>
            ), ...(items.map((item) => (
                <MenuItem style={{ padding: '0px 10px' }} key={item} value={item}>
                    <ListItemText primary={item} />
                </MenuItem>
            )))];
        }
        return (
            <div>
                <Tooltip title={titleStr} arrow open={tipOpen}>
                    <FormControl className={classes.formControl}>
                        {/* <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel> */}
                        <Select
                            // labelId="demo-mutiple-checkbox-label"
                            // id="demo-mutiple-checkbox"
                            multiple={multiple}
                            value={selectedValue}
                            onChange={this.handleChange}
                            onMouseEnter={this.handleEnter}
                            onMouseLeave={this.handleLeave}
                            onOpen={this.handleOpen}
                            // input={<Input />}
                            style={{ fontSize: '10px' }}
                            renderValue={(selected) => ((typeof selected === 'string') ? selected : selected.join(', '))}
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
};

MultipleSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    multiple: PropTypes.bool,
};

// const mapStateToProps = () => ({
//     // classes: PropTypes.object.isRequired,
//     // // state.reducer.initialState's content
//     // projects: state.projects.projects,
// });

// MultipleSelect = withStyles(useStyles, { name: 'MultipleSelect' })(MultipleSelect);
// export default connect(null, {})(MultipleSelect);

// export default connect(null, {})(withStyles(useStyles)(MultipleSelect));

export default compose(
    withStyles(useStyles, { name: 'MultipleSelect' }),
    connect(null, {}),
)(MultipleSelect);

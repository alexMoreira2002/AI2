import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { Menu, MenuItem, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

const BotoesPartilha = ({ url, title }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-controls="share-menu" aria-haspopup="true" onClick={handleClick}>
        <ShareIcon />
      </IconButton>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <FacebookShareButton url={url} quote={title}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FacebookIcon size={32} round />
              <span style={{ marginLeft: 10 }}>Facebook</span>
            </div>
          </FacebookShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <TwitterShareButton url={url} title={title}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TwitterIcon size={32} round />
              <span style={{ marginLeft: 10 }}>Twitter</span>
            </div>
          </TwitterShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <WhatsappShareButton url={url} title={title} separator=": ">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WhatsappIcon size={32} round />
              <span style={{ marginLeft: 10 }}>WhatsApp</span>
            </div>
          </WhatsappShareButton>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default BotoesPartilha;

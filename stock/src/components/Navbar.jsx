import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Stock Aggregator
      </Typography>
      <Button color="inherit" href="/">Stock Page</Button>
      <Button color="inherit" href="/heatmap">Correlation Heatmap</Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;

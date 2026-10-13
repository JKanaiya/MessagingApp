{ pkgs, lib, config, inputs, ... }:

{
  packages = [ 
    pkgs.nodejs_22
  ];

  languages = {
    javascript = {
      enable = true;
      nodejs.enable = true;
      pnpm.enable = true;
      pnpm.install.enable = true;
    };
  };
}

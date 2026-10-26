# Rapport de benchmark des ressources

- Date : 26/10/2026  9:08:19,50
- Systeme : Windows

## Informations sur l'hote Docker

```text
Client:
 Version:    29.8.2
 Context:    desktop-linux
 Debug Mode: false
 Plugins:
  agent: Docker AI Agent Runner (Docker Inc.)
    Version:  v1.144.0
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-agent.exe
  ai: Docker AI Agent - Ask Gordon (Docker Inc.)
    Version:  v1.31.0
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-ai.exe
  buildx: Docker Buildx (Docker Inc.)
    Version:  v0.37.2
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-buildx.exe
  compose: Docker Compose (Docker Inc.)
    Version:  v5.5.1
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-compose.exe
  debug: Get a shell into any image or container (Docker Inc.)
    Version:  0.0.47
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-debug.exe
  desktop: Docker Desktop commands (Docker Inc.)
    Version:  v0.4.4
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-desktop.exe
  dhi: CLI for managing Docker Hardened Images (Docker Inc.)
    Version:  v0.0.7
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-dhi.exe
  extension: Manages Docker extensions (Docker Inc.)
    Version:  v0.2.31
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-extension.exe
  init: Creates Docker-related starter files for your project (Docker Inc.)
    Version:  v1.4.0
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-init.exe
  mcp: Docker MCP Plugin (Docker Inc.)
    Version:  v0.44.1
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-mcp.exe
  model: Docker Model Runner (Docker Inc.)
    Version:  v1.2.6
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-model.exe
  offload: Docker Offload (Docker Inc.)
    Version:  v0.6.53
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-offload.exe
  pass: Docker Pass Secrets Manager Plugin (beta) (Docker Inc.)
    Version:  v0.2.4
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-pass.exe
  sandbox: "docker sandbox" is deprecated, use Docker Sandboxes instead (Docker Inc.)
    Version:  v0.13.0
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-sandbox.exe
  scout: Docker Scout (Docker Inc.)
    Version:  v1.25.0
    Path:     C:\Users\Utilisateur\.docker\cli-plugins\docker-scout.exe

Server:
 Containers: 3
  Running: 0
  Paused: 0
  Stopped: 3
 Images: 4
 Server Version: 29.8.2
 Storage Driver: overlayfs
  driver-type: io.containerd.snapshotter.v1
 Logging Driver: local
 Cgroup Driver: cgroupfs
 Cgroup Version: 2
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
 CDI spec directories:
  /etc/cdi
  /var/run/cdi
 Discovered Devices:
  cdi: docker.com/gpu=webgpu
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 nvidia runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: ee2735368117d2eb259779949d5e75cdafec9761
 runc version: v1.5.1-0-g8f2685a4
 init version: de40ad0
 Security Options:
  seccomp
   Profile: builtin
  cgroupns
 Kernel Version: 6.18.40.1-microsoft-standard-WSL2
 Operating System: Docker Desktop (containerized)
 OSType: linux
 Architecture: x86_64
 CPUs: 8
 Total Memory: 7.608GiB
 Name: docker-desktop
 ID: bda4036e-f21b-458d-986e-09665d74a81d
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 HTTP Proxy: http.docker.internal:3128
 HTTPS Proxy: http.docker.internal:3128
 No Proxy: hubproxy.docker.internal
 Labels:
  com.docker.desktop.address=npipe://\\.\pipe\docker_cli
 Experimental: false
 Insecure Registries:
  hubproxy.docker.internal:5555
  127.0.0.0/8
  ::1/128
 Live Restore Enabled: false
 Firewall Backend: iptables

```

## Version Docker

```text
Client:
 Version:           29.8.2
 API version:       1.56
 Go version:        go1.26.8
 Git commit:        7fc2dff
 Built:             Wed Sep 30 19:35:42 2026
 OS/Arch:           windows/amd64
 Context:           desktop-linux

Server: Docker Desktop 4.94.0 (241994)
 Engine:
  Version:          29.8.2
  API version:      1.56 (minimum version 1.40)
  Go version:       go1.26.8
  Git commit:       8af9fe3
  Built:            Wed Sep 30 19:32:25 2026
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          v2.3.6
  GitCommit:        ee2735368117d2eb259779949d5e75cdafec9761
 runc:
  Version:          1.5.1
  GitCommit:        v1.5.1-0-g8f2685a4
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

## Resultats

### CPU : sans limite

Commande : `docker run --rm severalnines/sysbench sysbench cpu --threads=4 run`

```text
sysbench 1.0.17 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 4
Initializing random number generator from current time


Prime numbers limit: 10000

Initializing worker threads...

Threads started!

CPU speed:
    events per second:  7447.59

General statistics:
    total time:                          10.0004s
    total number of events:              74491

Latency (ms):
         min:                                    0.32
         avg:                                    0.54
         max:                                   13.27
         95th percentile:                        0.84
         sum:                                39953.50

Threads fairness:
    events (avg/stddev):           18622.7500/83.25
    execution time (avg/stddev):   9.9884/0.00

```

Code de sortie : 0 - succes

### CPU : limite de 2 CPU

Commande : `docker run --rm --cpus=2 severalnines/sysbench sysbench cpu --threads=4 run`

```text
sysbench 1.0.17 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 4
Initializing random number generator from current time


Prime numbers limit: 10000

Initializing worker threads...

Threads started!

CPU speed:
    events per second:  3987.16

General statistics:
    total time:                          10.0333s
    total number of events:              40018

Latency (ms):
         min:                                    0.24
         avg:                                    1.00
         max:                                   60.98
         95th percentile:                        1.10
         sum:                                40098.08

Threads fairness:
    events (avg/stddev):           10004.5000/136.08
    execution time (avg/stddev):   10.0245/0.00

```

Code de sortie : 0 - succes

### CPU : limite de 0.5 CPU

Commande : `docker run --rm --cpus=0.5 severalnines/sysbench sysbench cpu --threads=4 run`

```text
sysbench 1.0.17 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 4
Initializing random number generator from current time


Prime numbers limit: 10000

Initializing worker threads...

Threads started!

CPU speed:
    events per second:  1249.53

General statistics:
    total time:                          10.0392s
    total number of events:              12546

Latency (ms):
         min:                                    0.24
         avg:                                    3.20
         max:                                   94.53
         95th percentile:                        1.03
         sum:                                40142.11

Threads fairness:
    events (avg/stddev):           3136.5000/98.95
    execution time (avg/stddev):   10.0355/0.00

```

Code de sortie : 0 - succes

### Memoire : sans limite

Commande : `docker run --rm severalnines/sysbench sysbench memory --threads=1 --memory-block-size=128M --memory-total-size=1G run`

```text
sysbench 1.0.17 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Running memory speed test with the following options:
  block size: 131072KiB
  total size: 1024MiB
  operation: write
  scope: global

Initializing worker threads...

Threads started!

Total operations: 8 (   60.59 per second)

1024.00 MiB transferred (7755.90 MiB/sec)


General statistics:
    total time:                          0.1303s
    total number of events:              8

Latency (ms):
         min:                                   14.43
         avg:                                   16.23
         max:                                   18.09
         95th percentile:                       17.95
         sum:                                  129.85

Threads fairness:
    events (avg/stddev):           8.0000/0.00
    execution time (avg/stddev):   0.1299/0.00

```

Code de sortie : 0 - succes

### Memoire : limite de 256 MiB, sans swap

Commande : `docker run --rm --memory=256m --memory-swap=256m severalnines/sysbench sysbench memory --threads=1 --memory-block-size=128M --memory-total-size=1G run`

```text
sysbench 1.0.17 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Running memory speed test with the following options:
  block size: 131072KiB
  total size: 1024MiB
  operation: write
  scope: global

Initializing worker threads...

Threads started!

Total operations: 8 (   68.21 per second)

1024.00 MiB transferred (8731.24 MiB/sec)


General statistics:
    total time:                          0.1157s
    total number of events:              8

Latency (ms):
         min:                                   13.80
         avg:                                   14.41
         max:                                   15.88
         95th percentile:                       15.83
         sum:                                  115.30

Threads fairness:
    events (avg/stddev):           8.0000/0.00
    execution time (avg/stddev):   0.1153/0.00

```

Code de sortie : 0 - succes

### Memoire : limite de 512 MiB, sans swap

Commande : `docker run --rm --memory=512m --memory-swap=512m severalnines/sysbench sysbench memory --threads=1 --memory-block-size=128M --memory-total-size=1G run`

```text
sysbench 1.0.17 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Running memory speed test with the following options:
  block size: 131072KiB
  total size: 1024MiB
  operation: write
  scope: global

Initializing worker threads...

Threads started!

Total operations: 8 (   62.47 per second)

1024.00 MiB transferred (7996.36 MiB/sec)


General statistics:
    total time:                          0.1265s
    total number of events:              8

Latency (ms):
         min:                                   13.66
         avg:                                   15.76
         max:                                   22.93
         95th percentile:                       23.10
         sum:                                  126.11

Threads fairness:
    events (avg/stddev):           8.0000/0.00
    execution time (avg/stddev):   0.1261/0.00

```

Code de sortie : 0 - succes

## Fin du benchmark

Tous les scenarios se sont termines avec succes le 26/10/2026 a  9:08:54,66.

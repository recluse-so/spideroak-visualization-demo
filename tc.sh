
# Add fixed amount of delay to all packets going out on device eth0.  
# Each packet will have added delay of 100ms ± 10ms.
tc qdisc add dev eth0 root netem delay 100ms

# This delays packets according to a normal distribution (Bellcurve) over a range of 100ms ± 20ms.
tc qdisc change dev eth0 root netem delay 100ms 20ms distribution normal
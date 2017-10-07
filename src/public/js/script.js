$(function() {
    console.log("UI is ready");

    var errorHandler = function(err) {
        console.log(err);
        showToaster({
            message: "Looks like something fucked up! Check the console...",
            type: "error"
        });
    };

    let showToaster = function(options) {
        let message, type;
        if (typeof options === "object") {
            message = options.message;
            type = options.type;
        } else {
            message = options;
            type = "info";
        }

        $("#toaster")
            .html('<div class="' + type + '">' + message + "</div>")
            .show()
            .delay(4000)
            .fadeOut(300);
    };

    // add user
    $("#add-user-click").click(() => {
        $.ajax("/api/user/add", {
            method: "post",
            data: {
                name: $("#add-user-name").val(),
                age: $("#add-user-age").val(),
                emailId: $("#add-user-email").val()
            },
            success: data => {
                renderUsers(data);
                $("#add-user-name").val("");
                $("#add-user-age").val("");
                $("#add-user-email").val("");
                showToaster("User Added Successfully");
            },
            error: errorHandler
        });
    });

    $("#add-host-click").click(() => {
        $.ajax("/api/host/add", {
            method: "post",
            data: {
                name: $("#add-host-name").val(),
                email: $("#add-host-email").val(),
                city: $("#add-host-city").val(),
                phone: $("#add-host-phone").val()
            },
            success: result => {
                renderHosts(result);
                $("#add-host-name").val("");
                $("#add-host-email").val("");
                $("#add-host-city").val("");
                $("#add-host-phone").val("");
                showToaster("Host Added Successfully");
            }
        });
    });
    // add events (gigs)
    $("#add-event-click").click(() => {
        $.ajax("/api/gig/add", {
            method: "post",
            data: {
                name: $("#add-event-name").val(),
                hostId: $("#event-host-list").val(),
                date: $("#add-event-date").val(),
                time: $("#add-event-time").val()
            },
            success: result => {
                renderGigs(result);
                $("#add-event-name").val("");
                $("#event-host-list").val("");
                $("#add-event-date").val("");
                $("#add-event-time").val("");
                showToaster("Gig Added Successfully");
            },
            error: errorHandler
        });
    });

    // add artists
    $("#add-artist-click").click(() => {
        $.ajax("/api/artist/add", {
            method: "post",
            data: {
                name: $("#add-artist-name").val(),
                age: $("#add-artist-age").val(),
                email: $("#add-artist-email").val(),
                genre: $("#add-artist-genre").val()
            },
            success: result => {
                renderArtists(result);
                $("#add-artist-name").val("");
                $("#add-artist-age").val("");
                $("#add-artist-genre").val("");
                $("#add-artist-email").val("");
                showToaster("Artist Added Successfully");
            },
            error: errorHandler
        });
    });

    /**
   * Create relation button click handlers
   */
    $("#add-user-host-like-relation").click(() => {
        $.ajax("/api/user/likehost", {
            method: "post",
            data: {
                personId: $("#user-likes-host").val(),
                hostId: $("#host-likes").val()
            },
            success: result => {
                showToaster("Like relation added successfully");
            }
        });
    });

    $("#add-user-artist-like-relation").click(() => {
        $.ajax("/api/user/likeartist", {
            method: "post",
            data: {
                personId: $("#user-likes-artist").val(),
                artistId: $("#artist-likes").val()
            },
            success: result => {
                showToaster("Like relation added successfully");
            }
        });
    });

    $("#add-attending-relation").click(() => {
        $.ajax("/api/user/attending", {
            method: "post",
            data: {
                personId: $("#users-attend").val(),
                gigId: $("#events-attend").val()
            },
            success: result => {
                showToaster("Attending relation added successfully");
            }
        });
    });

    $("#add-performing-relation").click(() => {
        $.ajax("/api/artist/performing", {
            method: "post",
            data: {
                artistId: $("#artists-perform").val(),
                gigId: $("#events-perform").val()
            },
            success: result => {
                showToaster("Performing relation added successfully");
            },
            error: errorHandler
        });
    });

    $("#show-linked-artists").click(() => {
        $.ajax("/api/user/showlinkedartists", {
            method: "post",
            data: {
                personId: $("#users-links").val()
            },
            success: result => {
                showToaster("Fetched linked artists successfully");
                var links = {};
                $.each(result, (index, item) => {
                    var aId = item.artist._id;
                    if (!links[aId]) {
                        links[aId] = {
                            artist: item.artist.properties.name,
                            gigs: []
                        };
                    }

                    links[aId].gigs.push(item.gig.properties.name);
                });

                links = Object.values(links);
                $("#linked-artists-results").html("");

                $.each(links, (index, item) => {
                    $("#linked-artists-results").append(
                        $("<div>").text(
                            [item.artist, "at", item.gigs.join(" & ")].join(" ")
                        )
                    );
                });
            },
            error: errorHandler
        });
    });

    $("#show-user-feed").click(() => {
        $.ajax("/api/user/feed", {
            method: "post",
            data: {
                personId: $("#users-feed").val()
            },
            success: result => {
                showToaster("Fetched feed successfully");
                var feedItems = {};
                debugger;
                $.each(result, (index, item) => {});

                feedItems = Object.values(feedItems);
                $("#user-feed-results").html("");

                $.each(feedItems, (index, item) => {
                    $("#user-feed-results").append(
                        $("<div>").text(
                            [item.artist, "at", item.gigs.join(" & ")].join(" ")
                        )
                    );
                });
            },
            error: errorHandler
        });
    });

    let renderUsers = personList => {
        let userListContainer = $("#user-list-container"),
            userAttendingDropdown = $("#users-attend"),
            userLikesHostDropdown = $("#user-likes-host"),
            userLikesArtistDropdown = $("#user-likes-artist"),
            userLinksDropdown = $("#users-links"),
            userFeedDropdown = $("#users-feed");

        $.each(personList, (i, item) => {
            var person = item.person.properties;

            var userElement = $("<div>");
            userElement.html(
                [person.emailId, person.name, person.age].join("; ")
            );
            userListContainer.append(userElement);

            var userOption = $("<option>")
                .attr({ value: item.person._id })
                .text(person.emailId);
            userAttendingDropdown.append(userOption.clone());
            userLikesHostDropdown.append(userOption.clone());
            userLikesArtistDropdown.append(userOption.clone());
            userFeedDropdown.append(userOption.clone());
            userLinksDropdown.append(userOption);
        });
    };

    let renderHosts = hostList => {
        let listContainer = $("#host-list-container"),
            likesDropdown = $("#host-likes"),
            eventHostSelect = $("#event-host-list");

        $.each(hostList, (i, item) => {
            var host = item.host.properties;

            var element = $("<div>");
            element.html([host.name, host.email, host.phone].join("; "));
            listContainer.append(element);

            var hostOption = $("<option>")
                .attr({ value: item.host._id })
                .text(host.name);
            eventHostSelect.append(hostOption.clone());
            likesDropdown.append(hostOption);
        });
    };

    let renderGigs = gigsList => {
        let listContainer = $("#event-list-container"),
            attendingDropdown = $("#events-attend"),
            performingDropdown = $("#events-perform");

        $.each(gigsList, (i, item) => {
            var gig = item.gig.properties;

            var element = $("<div>");
            element.html([gig.name, gig.date, gig.time].join("; "));
            listContainer.append(element);

            var option = $("<option>")
                .attr({ value: item.gig._id })
                .text(gig.name);
            attendingDropdown.append(option.clone());
            performingDropdown.append(option);
        });
    };

    let renderArtists = artistList => {
        let listContainer = $("#artist-list-container"),
            likesDropdown = $("#artist-likes"),
            dropdown = $("#artists-perform");

        $.each(artistList, (i, item) => {
            var artist = item.artist.properties;

            var userElement = $("<div>");
            userElement.html(
                [artist.name, artist.age, artist.genre].join("; ")
            );
            listContainer.append(userElement);

            var userOption = $("<option>")
                .attr({ value: item.artist._id })
                .text(artist.name);
            dropdown.append(userOption.clone());
            likesDropdown.append(userOption);
        });
    };

    let addArtistToEvent = data => {};

    let addPlaceToEvent = data => {};

    let rsvpToEvent = data => {};

    let getAllUsers = () => {
        $.ajax("/api/user/all", {
            success: data => {
                renderUsers(data);
            },
            error: errorHandler
        });
    };

    let getAllGigs = () => {
        $.ajax("/api/gig/all", {
            success: data => {
                renderGigs(data);
            }
        });
    };

    let getAllArtists = () => {
        $.ajax("/api/artist/all", {
            success: data => {
                renderArtists(data);
            }
        });
    };

    let getAllHosts = () => {
        $.ajax("/api/host/all", {
            success: data => {
                renderHosts(data);
            }
        });
    };

    getAllUsers();
    getAllGigs();
    getAllArtists();
    getAllHosts();
});

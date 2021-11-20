const socket = io('https://first-server-webrtc.herokuapp.com/');

$('.logged-in').hide();



socket.on('DANH_SACH_ONLINE', userNameInfo => {
    $('.logged-in').show();
    $('.sign-up').hide();
    userNameInfo.forEach((user) => {
        $('#userOnline_list').append(`<li id="${user.peerId}">ten: ${user.ten} </li>`);
    });

    socket.on('TEN_NGUOI_DANG_NHAP', name => {
        $('.name-user').append(name);
    });

    socket.on('CO_NGUOI_MOI_DANG_NHAP', userOnline => {
        $('#userOnline_list').append(`<li id="${userOnline.peerId}">ten: ${userOnline.ten} </li>`);

    });



    socket.on('AI_DO_DA_NGAT_KET_NOI', peerId => {

        $(`#${peerId}`).remove();
    })

})

socket.on('DA_CO_TEN_NGUOI_DUNG_NAY', () => alert("Đã Có Tên Người Dùng Này"));

function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(nameStream, stream) {
    const video = document.getElementById(nameStream);
    video.srcObject = stream;
    video.play();
}

// openStream()
//     .then(stream => playStream('localStream', stream))

// caller
var peer = new Peer();
peer.on('open', function (id) {
    $('#peer-id').append(id);
    $('.btn-submit-signup').click(() => {

        const user = $('#input-user').val();
        socket.emit("NGUOI_DUNG_DANG_KY", { ten: user, peerId: id });

    });


});
//caller

$('.btn-submit-id').click(() => {

    const id = $('#input-peer-id').val();

    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', (removeStream) => {
                playStream('remoteStream', removeStream);
            })
        });

});
// người nhận
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', (removeStream) => {
                playStream('remoteStream', removeStream);
            })

        })
})
// gọi điện

$('#userOnline_list').on('click', 'li', function () {
    let id = $(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', (removeStream) => {
                playStream('remoteStream', removeStream);
            })
        });

})
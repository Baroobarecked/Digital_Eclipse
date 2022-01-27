import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as albumActions from '../../store/album'
import * as userActions from '../../store/session'



export default function VrMain() {
    const albums = useSelector(state => state.albums);
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.User)
    const [songComponents, setSongComponents] = useState([])
    const [pause, setPause] = useState(false)

    
    let components = [];
    function makeAlbums () {
        if(albums) {
            albums.albums.forEach(async album => {
                components.push(
                    <a-entity class="albums"
                    geometry="primitive: plane; height: 1; width: 1"
                    material={`shader: flat; src: ${album.album_cover}`}
                    event-set__mouseenter="scale: 1.2 1.2 1"
                    event-set__mouseleave="scale: 1 1 1"
                    id={`${album.id}`}
                    >
                    </a-entity>
                )
            })
            return components
        }
    }

    useEffect(() => {
        let albums = document.querySelectorAll('.albums')
        if(albums) {
            albums.forEach(album => {
                album.addEventListener('click', e => {
                    attachMusic(e.target.id)
                })
            })
        }

    })

    useEffect(() => {
        document.querySelectorAll('.audiofiles').forEach(component => {
            component.addEventListener('click', (e) => {
                e.stopPropagation()
                let player = document.getElementById('audio_player')
                if(player.src == e.target.id) {
                    
                    if(pause) {
                        // 
                        player.play();
                        // setPause(!pause)
                    } else {
                        player.pause();
                        // 
                    }
                    setPause(!pause)
                } else {
                    player.src = ''
                    player.src = e.target.id;
                    player.play()
                }
            })
        })
    }, [songComponents, pause])
        
    async function attachMusic(albumId) {
        let res = await fetch(`/api/albums/${albumId}/songs`)
        if(res.ok) {
            setSongComponents('')
            let data = await res.json()
            let sides = [];
            data.songs.forEach(side => {
                let songSplit = side.songs.split(/\['|',\s'|'\]|\["|",\s"|"\]|',\s"|",\s'/)
                const test = /.*[a-zA-Z0-9]+.*/;
                let songData = songSplit.filter(item => item.match(test));
                let url = songData.shift();
                sides.push(
                    <>
                        <a-entity geometry='primitive: box' 
                            class='audiofiles' id={`${url}`}></a-entity>
                    </>
                )
            });
            let entity = (
                <a-entity id="links2" layout="type: line; margin: 1.5" position="0 5 0">
                    {sides}
                </a-entity>
            )
            setSongComponents(entity)
        }
    }
    
    useEffect(async () => {
        await dispatch(albumActions.getUserAlbums(currentUser.id))
        document.getElementById('enter').addEventListener('click', () => {
            document.getElementById('scene').enterVR();
        })
    }, [])
    
    makeAlbums()
    return (
        <>
            <audio id='audio_player' crossOrigin='anonymous'></audio>
            <a-scene id='scene'>
                
                <a-assets id='assets'>
                <img id="boxTexture" src="https://i.imgur.com/mYmmbrp.jpg" />
                <img id="skyTexture" crossOrigin="anonymous"
                    src={require("./VRassets/3dspacesmaller.jpg")} />
                    <img id="groundTexture" src="/deeprecord.jpg" />
                    <img id='tableTexture' src={require("./VRassets/woodtext.jpg")} />
                    <img id='recordTexture' src={require("./VRassets/tinyrecord.png")} />
                    <audio id="music" ></audio>

                </a-assets>
                <a-box src='#tableTexture' position="0 0 0" scale='4 1 2' repeat='1 5'>
                </a-box>

                <a-box src="#groundTexture" position="0 .75 0" scale="2 .5 1.5">
                    <a-entity
                        text="value: Hello, A-Frame!; color: #BBB"
                        position=".5s 2 0"
                        scale="2 2 2s"
                        color='black'></a-entity>
                </a-box>

                <a-box id='enter' position='3 0 0'></a-box>

                <a-cylinder src='#recordTexture' position='0 1 0' scale='.5 .01 .5'
                 animation="property: rotation; to: 0 -360 0; easing: linear; dur: 2000; loop: true"></a-cylinder>

                <a-sky src="#skyTexture"></a-sky>
                {/* <a-plane src="#groundTexture" rotation="-90 0 0" width="300" height="300"
                    ></a-plane> */}

                <a-light type="ambient" color="#445451"></a-light>
                <a-light type="point" intensity="2" position="2 4 4"></a-light>

                <a-entity id="links" layout="type: line; margin: 1.5" position="-3 3 -4">
                    {components}
                </a-entity>
                
                {songComponents}
                {/* <a-entity tracked-controls="controller: 0; idPrefix: OpenVR"></a-entity>

                <a-entity laser-controls="hand: left"></a-entity>
                <a-entity laser-controls="hand: right"></a-entity> */}
                {/* <a-entity camera look-controls position="0 1.6 0"></a-entity> */}
                {/* <a-entity hand-controls="left"></a-entity>
                <a-entity hand-controls="right"></a-entity> */}
                {/* <a-entity oculus-touch-controls="hand: left"></a-entity>
                <a-entity oculus-touch-controls="hand: right"></a-entity> */}
                {/* <a-entity id="cameraRig" navigator="cameraRig: #cameraRig;
                 collisionEntities: .collision; ignoreEntities: .clickable" position="0 0 0" rotation="0 0 0">
   
                <a-entity id="head" camera="active: true" position="0 1.6 0" look-controls="pointerLockEnabled: true; reverseMouseDrag: true" ></a-entity>
          
                <a-entity id="leftHand" hand-controls="hand: left; handModelStyle: lowPoly; color: rgba(255, 255, 255, 0.7)" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head; button: trigger; curveShootingSpeed: 18; landingMaxAngle: 60" visible="true"></a-entity>
            
                <a-entity id="rightHand" hand-controls="hand: right; handModelStyle: lowPoly; color: rgba(255, 255, 255, 0.7)" laser-controls raycaster="showLine: true; far: 10; interval: 0; objects: .clickable, a-link;" line="color: red; opacity: 0.5" visible="true"></a-entity>
                </a-entity> */}

                <a-camera><a-cursor></a-cursor></a-camera>
            </a-scene>
            <button id='enter' style={{
                position: 'absolute'
            }} onClick={() => {
                document.getElementById('scene').enterVR();
            }}>Button</button>
        </>
    )
}
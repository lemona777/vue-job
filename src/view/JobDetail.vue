<template>
    <section v-if="isLogin && post">
        <figure v-if="post.img_url">
            <img :src="post.img_url" alt="head image">
        </figure>

        <!-- 상세정보 -->
        <div class="container" v-if="post">
            <h2>{{post.title}}</h2>
            <p class="top_info">
                {{post.company_name}}
                <span>&middot;</span>
                {{post.location}}
            </p>
            <p class="pay">
                {{post.pay_rule}}: <b>{{post.pay.toLocaleString()}}</b>
            </p>
            <textarea class="desc" rows="5" disabled>{{post.desc}}</textarea>
        </div>
        <!-- 하단 고정 버튼 -->
        <div class="bottom-btn-group" v-if="post && post.author !== user.id">
            <a class="btn-tel" :href="`tel:${post.tel}`">전화문의</a>
            <button class="btn-apply-disable" v-if="isApplied">지원완료</button>
            <button class="btn-apply" @click="handleApply" v-if="!isApplied">지원하기</button>
        </div>
        <div class="bottom-btn-group" v-if="post && post.author === user.id">
            <router-link class="btn-tel" :to="`/job-post-update/${post.id}`">수정</router-link>
            <button class="btn-apply" @click="handleDelete">삭제</button>
        </div>
    </section>
</template>
    
  <script setup>
  import { useAuth } from '../auth/auth'
  import { useRoute, useRouter } from 'vue-router';
  import supabase from '../supabase';
  import { ref, onMounted } from 'vue';
  
  const { isLogin, user, checkLoginStatus } = useAuth();
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id;
  const post = ref(null);
  const isApplied = ref(false);

  const checkApply = async () => {
    const { data, error } = await supabase
      .from('job_apply_list')
      .select()
      .eq('applicant_id', user.value.id)
      .eq('post_id', id);

      if(error) {
        alert('오류가 발생했습니다.');
        return;
      }

      if(data.length > 0) {
        isApplied.value = true;
      }
  }

  const handleApply = async () => {
    const { data, error } = await supabase
      .from('user_table')
      .select()
      .eq('id', user.value.id)
      .single();

      if(error) {
        alert('오류가 발생했습니다.');
        return;
      }

    const { error: err } = await supabase
      .from('job_apply_list')
      .insert({
        job_title: post.value.title,
        employer_id: post.value.author,
        applicant_id: user.value.id,
        applicant_name: data.name,
        applicant_tel: data.tel,
        post_id: post.value.id,
      })

      if(err) {
        alert('오류가 발생했습니다.');
      } else {
        alert('지원이 완료되었습니다.');
        router.push('/job-list');
      }
  }

  const deleteImage = async () => {
    if(post.value.img_url) {
      const { data, error } = await supabase
        .storage
        .from('images')
        .remove([post.value.img_url.split('/').pop()]);
      if(error) console.log('이미지 삭제 실패');
    }
  }

  const handleDelete = async () => {
    const conf = confirm('정말 삭제하겠습니까?')

    if (!conf) return;

    await deleteImage();

    const { error } = await supabase
      .from('job_posts')
      .delete()
      .eq('id', id)

      if(error) {
        alert('글삭제 실패')
      } else {
        alert('삭제 완료');
        router.push('/job-list')
      }
  }
  
  // DB에서 글 가져오기
  onMounted(async () => {

    await checkLoginStatus(); // ③ 로그인 상태 확인

    if(user.value) {
        const { data, error } = await supabase
        .from('job_posts')
        .select()
        .eq('id', id)
        .single()
    
        post.value = data;
    
        if(error) {
            alert(error.message);
            return;
        }
    }
0
    checkApply();
  });
  
  </script>
    
  <style scoped lang="scss">
  figure {
    aspect-ratio: 16 / 9;
  
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  h2 {
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  .top_info {
    font-size: 12px;
    color: #666;
    margin-bottom: 16px;
  }
  
  .pay {
    font-size: 14px;
    font-weight: bold;
    color: #444;
    padding: 10px 0;
    margin-bottom: 16px;
  }
  
  .desc {
    width: 100%;
    padding: 0px;
    border: none;
    line-height: 22px;
    margin-bottom: 10px;
    outline: none;
    background: #fff;
  }
  
  .bottom-btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    
    button, .btn-tel {
      width: 50%;
      border-radius: 0;
      padding-top: 14px;
      padding-bottom: 14px;
      margin: 0;
      cursor: pointer;
      text-align: center;
      color: #fff;
      text-decoration: none;
    }
    
    .btn-tel {
      background-color: var(--main-color-dark);
    }
    
    .btn-apply {
      background-color: var(--main-color-light);
    }

    .btn-apply-disable {
      background-color: #ccc;
    }
  }
  </style>